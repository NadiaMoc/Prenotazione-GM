const express = require('express');
const cors = require('cors');
const prisma = require('./lib/prisma');
const { sendReservationConfirmationEmail, sendEmail, isEmailConfigured } = require('./services/emailService');
const appName = process.env.APP_NAME || 'Prenotazione GM';

const HORARIOS_BASE = [
  '09:00', '09:15', '09:30', '09:45',
  '10:00', '10:15', '10:30', '10:45',
  '11:00', '11:15', '11:30', '11:45',
  '12:00', '12:15', '12:30', '12:45',
  '13:00', '13:15', '13:30', '13:45',
  '14:00', '14:15', '14:30', '14:45'
];

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [corsOrigin, 'http://localhost:5173', 'http://localhost:5174'];
    const isLocalhostOrigin = /^http:\/\/localhost:\d+$/.test(origin);

    if (allowedOrigins.includes(origin) || isLocalhostOrigin) {
      return callback(null, true);
    }

    return callback(new Error('CORS origin not allowed'));
  }
}));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true, service: 'backend', timestamp: new Date().toISOString() });
});

// debug route to verify email configuration and send a test message
app.get('/debug/email', async (req, res) => {
  const to = req.query.to;
  if (!to) {
    return res.status(400).json({ message: 'Query parameter "to" required' });
  }

  // provide minimal content
  const emailResult = await sendEmail({
    to,
    subject: `Test email - ${appName}`,
    text: 'Questo è un messaggio di prova.',
    html: '<p>Questo è un messaggio di prova.</p>'
  });

  return res.status(200).json({ isEmailConfigured, emailResult });
});

app.get('/eventos', async (_req, res) => {
  try {
    const eventos = await prisma.evento.findMany({
      where: { activo: true },
      orderBy: { fecha: 'asc' }
    });

    res.status(200).json(eventos);
  } catch (error) {
    console.error('GET /eventos error:', error);
    res.status(500).json({ message: 'Error obteniendo eventos.' });
  }
});

app.post('/eventos', async (req, res) => {
  try {
    const { fecha, direccion, datoAdicional } = req.body;

    if (!fecha || !direccion) {
      return res.status(400).json({ message: 'fecha y direccion son obligatorios.' });
    }

    const parsedFecha = new Date(fecha);

    if (Number.isNaN(parsedFecha.getTime())) {
      return res.status(400).json({ message: 'fecha inválida. Usa formato YYYY-MM-DD.' });
    }

    const evento = await prisma.evento.create({
      data: {
        fecha: parsedFecha,
        direccion: String(direccion).trim(),
        datoAdicional: datoAdicional ? String(datoAdicional).trim() : null
      }
    });

    return res.status(201).json(evento);
  } catch (error) {
    console.error('POST /eventos error:', error);
    return res.status(500).json({ message: 'Error creando evento.' });
  }
});

app.get('/eventos/:eventoId/reservas', async (req, res) => {
  try {
    const { eventoId } = req.params;

    const reservas = await prisma.reserva.findMany({
      where: { eventoId },
      orderBy: { horario: 'asc' }
    });

    return res.status(200).json(reservas);
  } catch (error) {
    return res.status(500).json({ message: 'Error obteniendo reservas del evento.' });
  }
});

app.get('/eventos/:eventoId/disponibilidad', async (req, res) => {
  try {
    const { eventoId } = req.params;

    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });

    if (!evento || !evento.activo) {
      return res.status(404).json({ message: 'Evento no encontrado o inactivo.' });
    }

    const reservas = await prisma.reserva.findMany({
      where: { eventoId },
      select: { horario: true }
    });

    const ocupados = reservas.map((reserva) => reserva.horario).sort((a, b) => a.localeCompare(b));
    const libres = HORARIOS_BASE.filter((hora) => !ocupados.includes(hora));

    return res.status(200).json({ eventoId, libres, ocupados });
  } catch (error) {
    return res.status(500).json({ message: 'Error obteniendo disponibilidad del evento.' });
  }
});

app.post('/reservas', async (req, res) => {
  try {
    const { eventoId, nombre, email, celular, horario } = req.body;

    if (!eventoId || !nombre || !email || !celular || !horario) {
      return res.status(400).json({ message: 'eventoId, nombre, email, celular y horario son obligatorios.' });
    }

    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });

    if (!evento || !evento.activo) {
      return res.status(404).json({ message: 'Evento no encontrado o inactivo.' });
    }

    const reserva = await prisma.reserva.create({
      data: {
        eventoId,
        nombre: String(nombre).trim(),
        email: String(email).trim(),
        celular: String(celular).trim(),
        horario: String(horario).trim()
      }
    });

    try {
      const emailResult = await sendReservationConfirmationEmail({
        nombre: reserva.nombre,
        email: reserva.email,
        horario: reserva.horario,
        evento
      });

      console.log('Email send result for reserva', reserva.id, emailResult);

      if (emailResult.sent) {
        await prisma.reserva.update({
          where: { id: reserva.id },
          data: { confirmationSentAt: new Date() }
        });
      }
    } catch (emailError) {
      console.error('Error enviando confirmación:', emailError.message);
    }

    return res.status(201).json(reserva);
  } catch (error) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ message: 'Ese horario ya está reservado para este evento.' });
    }

    return res.status(500).json({ message: 'Error creando reserva.' });
  }
});

app.delete('/reservas/:reservaId', async (req, res) => {
  try {
    const { reservaId } = req.params;

    const reserva = await prisma.reserva.findUnique({ where: { id: reservaId } });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada.' });
    }

    await prisma.reserva.delete({ where: { id: reservaId } });

    return res.status(200).json({ message: 'Reserva cancelada correctamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error cancelando reserva.' });
  }
});

app.delete('/eventos/:eventoId', async (req, res) => {
  try {
    const { eventoId } = req.params;

    const evento = await prisma.evento.findUnique({ where: { id: eventoId } });

    if (!evento) {
      return res.status(404).json({ message: 'Evento no encontrado.' });
    }

    await prisma.evento.update({
      where: { id: eventoId },
      data: { activo: false }
    });

    return res.status(200).json({ message: 'Evento desactivado correctamente.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error eliminando evento.' });
  }
});

module.exports = app;
