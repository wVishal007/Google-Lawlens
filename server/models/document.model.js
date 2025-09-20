// models/Document.js
import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileUrl: { type: String, required: true },
  filename: { type: String, required: true },
  type: { type: String, required: true }, // e.g. contract, affidavit
  status: { type: String, enum: ['safe', 'needs_changes'], default: 'safe' },
  signed: { type: Boolean, default: false },
  auditTrail: [{
    action: { type: String, enum: ['uploaded', 'edited', 'approved'], required: true },
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export const Document = mongoose.model('Document', DocumentSchema);