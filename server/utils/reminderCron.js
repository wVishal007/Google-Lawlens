// utils/reminderCron.js

import cron from 'node-cron';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

// SMTP Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: +process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ─── Send Reminder Email ──────────────────────────────────────────────────
export async function sendReminderEmail(userEmail, activity) {
  const mailOptions = {
    from: `"Legal System" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Reminder: ${activity.title} on ${activity.date.toDateString()}`,
    text: `Dear User,\n\nThis is a reminder for your activity:\n\nTitle: ${activity.title}\nDescription: ${activity.description || 'N/A'}\nDate: ${activity.date.toDateString()} at ${activity.time}\n\nPlease take necessary action.\n\nRegards,\nLegal System`,
  };

  await transporter.sendMail(mailOptions);
}

// ─── Start Cron Job ───────────────────────────────────────────────────────
export function startReminderCronJob() {
  cron.schedule('*/5 * * * *', async () => {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now

    try {
      // Find activities with reminder not sent, scheduled within next 10 minutes
      const activities = await Activity.find({
        emailReminderSent: false,
        date: {
          $lte: windowEnd,
          $gte: now,
        },
      }).populate('user');

      for (const activity of activities) {
        // Compose datetime for activity time today
        const [hour, minute] = activity.time.split(':').map(Number);
        const activityDateTime = new Date(activity.date);
        activityDateTime.setHours(hour, minute, 0, 0);

        if (activityDateTime >= now && activityDateTime <= windowEnd) {
          const user = await User.findById(activity.user);
          if (user) {
            await sendReminderEmail(user.email, activity);

            // Mark emailReminderSent true if no recurrence
            if (activity.repeatFrequency === 'none') {
              activity.emailReminderSent = true;
              await activity.save();
            } else {
              // For recurring, update date for next occurrence
              switch (activity.repeatFrequency) {
                case 'daily':
                  activity.date.setDate(activity.date.getDate() + 1);
                  break;
                case 'weekly':
                  activity.date.setDate(activity.date.getDate() + 7);
                  break;
                case 'monthly':
                  activity.date.setMonth(activity.date.getMonth() + 1);
                  break;
              }
              await activity.save();
            }
          }
        }
      }
    } catch (err) {
      console.error('Error in reminder cron job:', err);
    }
  });
}