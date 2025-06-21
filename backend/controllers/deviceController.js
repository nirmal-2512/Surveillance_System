import Device from '../models/Device.js';

// GET /api/devices - Get all devices for the logged-in user
export const getUserDevices = async (req, res) => {
  try {
    const devices = await Device.find({ user: req.user.id }).populate('videos');
    res.json(devices);
  } catch (err) {
    console.error('Error fetching devices:', err.message);
    res.status(500).json({ message: 'Server error fetching devices' });
  }
};

// POST /api/devices - Add a new device
export const addDevice = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'Device name is required' });
  }

  try {
    const device = await Device.create({ user: req.user.id, name });
    res.status(201).json(device);
  } catch (err) {
    console.error('Error adding device:', err.message);
    res.status(500).json({ message: 'Server error adding device' });
  }
};
