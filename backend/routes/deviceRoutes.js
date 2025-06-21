import express from 'express';
import { getUserDevices, addDevice } from '../controllers/deviceController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserDevices);
router.post('/', protect, addDevice);

export default router;

