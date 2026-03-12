const nodemailer = require('nodemailer');

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const mailFrom = process.env.MAIL_FROM || smtpUser;
const appName = process.env.APP_NAME || 'Prenotazione GM';

const isEmailConfigured = Boolean(smtpHost && smtpPort && smtpUser && smtpPass && mailFrom);

if (!isEmailConfigured) {
    console.warn('⚠️ Email service is NOT configured. Verify SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and MAIL_FROM env vars.');
} else {
    console.log('✅ Email service is configured');
}

const transporter = isEmailConfigured
? nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
    })
: null;

const formatDate = (value) => {
const date = new Date(value);
if (Number.isNaN(date.getTime())) {
    return String(value);
}
return date.toLocaleDateString('it-IT');
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!isEmailConfigured || !transporter) {
    console.warn('Attempted to send email but configuration is missing');
    return { sent: false, reason: 'EMAIL_NOT_CONFIGURED' };
  }

  try {
    await transporter.sendMail({
      from: mailFrom,
      to,
      subject,
      text,
      html
    });
    return { sent: true };
  } catch (err) {
    console.error('Email send error:', err.message);
    return { sent: false, reason: err.message };
  }
};

const sendReservationConfirmationEmail = async ({ nombre, email, evento, horario }) => {
  const fecha = formatDate(evento.fecha);
  const subject = `Conferma prenotazione - ${appName}`;
  const text = `Ciao ${nombre}, la tua prenotazione è confermata.\n\nData: ${fecha}\nIndirizzo: ${evento.direccion}${evento.datoAdicional ? `\nDettagli aggiuntivi: ${evento.datoAdicional}` : ''}\nOrario: ${horario}\n\nGrazie.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Prenotazione confermata</h2>
      <p>Ciao <strong>${nombre}</strong>, la tua prenotazione è confermata.</p>
      <p><strong>Data:</strong> ${fecha}</p>
      <p><strong>Indirizzo:</strong> ${evento.direccion}</p>
      ${evento.datoAdicional ? `<p><strong>Dettagli aggiuntivi:</strong> ${evento.datoAdicional}</p>` : ''}
      <p><strong>Orario:</strong> ${horario}</p>
      <p>Grazie.</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

const sendReservationReminderEmail = async ({ nombre, email, evento, horario }) => {
  const fecha = formatDate(evento.fecha);
  const subject = `Promemoria evento (24h) - ${appName}`;
  const text = `Ciao ${nombre}, questo è un promemoria del tuo evento di domani.\n\nData: ${fecha}\nIndirizzo: ${evento.direccion}${evento.datoAdicional ? `\nDettagli aggiuntivi: ${evento.datoAdicional}` : ''}\nOrario: ${horario}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Promemoria evento</h2>
      <p>Ciao <strong>${nombre}</strong>, questo è un promemoria del tuo evento di domani.</p>
      <p><strong>Data:</strong> ${fecha}</p>
      <p><strong>Indirizzo:</strong> ${evento.direccion}</p>
      ${evento.datoAdicional ? `<p><strong>Dettagli aggiuntivi:</strong> ${evento.datoAdicional}</p>` : ''}
      <p><strong>Orario:</strong> ${horario}</p>
    </div>
  `;

  return sendEmail({ to: email, subject, text, html });
};

module.exports = {
  isEmailConfigured,
  sendEmail,                    // exposed for debugging
  sendReservationConfirmationEmail,
  sendReservationReminderEmail
};
