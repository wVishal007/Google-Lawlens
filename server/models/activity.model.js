// models/Activity.js
import mongoose from "mongoose";

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true }, // store time as HH:mm format string
  repeatFrequency: { type: String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none' },
  emailReminderSent: { type: Boolean, default: false },
}, { timestamps: true });

export const Activity = mongoose.model('Activity', ActivitySchema);