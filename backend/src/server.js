require('dotenv').config();

const app = require('./app');
const { startReminderJob } = require('./jobs/reminderJob');

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  
  // En desarrollo, inicia el cron job localmente
  if (process.env.NODE_ENV === 'development') {
    startReminderJob();
    console.log('Reminder job active (runs every hour).');
  } else {
    console.log('Running in production - use cron-job.org for reminders');
  }
});
