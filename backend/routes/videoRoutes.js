// routes/videoRoutes.js
import express from 'express';
import { getUserVideos, uploadVideo } from '../controllers/videoController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserVideos);
router.post('/', protect, uploadVideo);

export default router;
