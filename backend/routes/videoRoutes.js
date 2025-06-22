// routes/videoRoutes.js
import express from 'express';
import multer from 'multer';
import protect from '../middleware/authMiddleware.js';
import Video from '../models/Video.js';
import Device from '../models/Device.js';

const router = express.Router();

// configure multer to write into uploads/videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/videos'),
  filename:    (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

router.post(
  '/upload',
  protect,
  upload.single('video'),
  async (req, res) => {
    const { deviceId } = req.body;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    try {
      // make sure device belongs to user
      const device = await Device.findOne({ _id: deviceId, user: req.user.id });
      if (!device) return res.status(404).json({ message: 'Device not found' });

      // save video record
      const video = await Video.create({
        user:   req.user.id,
        device: deviceId,
        path:   `/uploads/videos/${req.file.filename}`
      });

      // add to device.videos array
      device.videos.push(video._id);
      await device.save();

      res.status(201).json(video);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Upload failed' });
    }
  }
);

export default router;
