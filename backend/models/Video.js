// models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  path:   { type: String, required: true },
  recordedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Video', videoSchema);
