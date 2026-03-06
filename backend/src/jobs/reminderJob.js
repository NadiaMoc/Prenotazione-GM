const cron = require('node-cron');
const prisma = require('../lib/prisma');
const { isEmailConfigured, sendReservationReminderEmail } = require('../services/emailService');

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const processReminderEmails = async () => {
  if (!isEmailConfigured) {
    return;
  }

  const now = new Date();
  const windowStart = new Date(now.getTime() + (23 * ONE_HOUR_IN_MS));
  const windowEnd = new Date(now.getTime() + (25 * ONE_HOUR_IN_MS));

  const pendingReminders = await prisma.reserva.findMany({
    where: {
      reminderSentAt: null,
      evento: {
        activo: true,
        fecha: {
          gte: windowStart,
          lte: windowEnd
        }
      }
    },
    include: {
      evento: true
    }
  });

  for (const reserva of pendingReminders) {
    try {
      const result = await sendReservationReminderEmail({
        nombre: reserva.nombre,
        email: reserva.email,
        horario: reserva.horario,
        evento: reserva.evento
      });

      if (result.sent) {
        await prisma.reserva.update({
          where: { id: reserva.id },
          data: { reminderSentAt: new Date() }
        });
      }
    } catch (error) {
      console.error('Error enviando recordatorio:', error.message);
    }
  }
};

const startReminderJob = () => {
  cron.schedule('0 * * * *', async () => {
    await processReminderEmails();
  });
};

module.exports = {
  startReminderJob,
  processReminderEmails
};
