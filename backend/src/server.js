require('dotenv').config();

const app = require('./app');
const { startReminderJob } = require('./jobs/reminderJob');

const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
  startReminderJob();
  console.log('Reminder job active (runs every hour).');
});
