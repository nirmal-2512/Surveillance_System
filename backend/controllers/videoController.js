// controllers/videoController.js
import Video from "../models/Video.js";
import Device from "../models/Device.js";

export const getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id }).populate("device");
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching videos" });
  }
};

export const uploadVideo = async (req, res) => {
  const { deviceId, url, duration } = req.body;

  try {
    const video = await Video.create({
      device: deviceId,
      user: req.user.id,
      url,
      duration,
    });

    // Optional: Add video ref to device
    await Device.findByIdAndUpdate(deviceId, { $push: { videos: video._id } });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: "Error uploading video" });
  }
};
