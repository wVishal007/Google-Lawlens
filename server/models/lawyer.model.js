import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  location: { type: String, required: true },
  hourlyRate: { type: Number, required: true },
}, {
  timestamps: true
});

export const Lawyer = mongoose.model('Lawyer', lawyerSchema);
