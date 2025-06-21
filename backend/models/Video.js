// models/Video.js
import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  url: { type: String, required: true }, // local or cloud file URL
  timestamp: { type: Date, default: Date.now },
  duration: { type: Number }, // optional
});

export default mongoose.model('Video', videoSchema);
