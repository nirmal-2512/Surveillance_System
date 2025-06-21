import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['online', 'offline'], default: 'offline' },
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }], // ref to Video model
}, { timestamps: true });

export default mongoose.model('Device', deviceSchema);
