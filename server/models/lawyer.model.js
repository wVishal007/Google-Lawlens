import mongoose from 'mongoose';

const lawyerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  name: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true }, // years
  rating: { type: Number, default: 0 },
  location: { type: String, required: true },
  hourlyRate: { type: Number, required: true },

  // optional fields
  bio: { type: String },
  phone: { type: String },
  profilePic: { type: String, default: "" },
  documentUrl: { type: String }, // license/certificate

}, { timestamps: true });

export const Lawyer = mongoose.model('Lawyer', lawyerSchema);
