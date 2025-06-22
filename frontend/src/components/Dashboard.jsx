import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [storageUsed, setStorageUsed] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState("");

  const videoRef = useRef(null);
  const [cameraReady, setCameraReady] = useState(false);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const { token } = useAuth();

  useEffect(() => {
    // load devices and videos, start camera
    fetchDevices();
    fetchVideos();
    startCamera();
  }, []);

  const fetchDevices = async () => {
    try {
      const res = await fetch("/api/devices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch devices");
      const data = await res.json();
      setDevices(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch("/api/videos/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch videos");
      const list = await res.json();
      setVideos(list);
      const totalMB = list.reduce((sum, v) => sum + (v.sizeMB || 1.5), 0);
      setStorageUsed(totalMB);
    } catch (err) {
      console.error(err);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      console.log("🎥 Camera stream ready:", stream);
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setCameraReady(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const startRecording = () => {
    console.log(
      "🔴 startRecording called, cameraReady:",
      cameraReady,
      "streamRef:",
      streamRef.current
    );
    if (!selectedDevice) return alert("Select a device first");
    if (!streamRef.current) return alert("Camera not initialized");

    chunksRef.current = [];
    const recorder = new MediaRecorder(streamRef.current, {
      mimeType: "video/webm",
    });
    recorder.ondataavailable = (e) => {
      console.log("📦 chunk:", e.data);
      chunksRef.current.push(e.data);
    };
    recorder.onstart = () => console.log("▶️ recorder started");
    recorder.onstop = () =>
      console.log("⏹ recorder stopped, chunks:", chunksRef.current.length);
    recorder.onstop = handleRecordingStop;
    recorder.start();
    recorderRef.current = recorder;
    setIsRecording(true);
  };

  const handleRecordingStop = async () => {
    const blob = new Blob(chunksRef.current, { type: "video/webm" });
    const fd = new FormData();
    fd.append("video", blob, `recording-${Date.now()}.webm`);
    fd.append("deviceId", selectedDevice);

    try {
      const res = await fetch("/api/videos/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      await fetchVideos();
    } catch (err) {
      console.error("Upload error:", err);
      alert("Video upload failed");
    } finally {
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  };

  return (
    <div className="text-white bg-[#0B192C] min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <label htmlFor="device-select" className="mr-2">
          Select Device:
        </label>
        <select
          id="device-select"
          className="p-2 bg-[#1E3E62] rounded"
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
        >
          <option value="" disabled>
            -- select device --
          </option>
          {devices.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name} ({d.status})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 bg-[#1E3E62] p-4 rounded-lg">
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-72 bg-black rounded"
          />
          <div className="mt-4 flex justify-end">
            {!isRecording ? (
              <button
                onClick={startRecording}
                disabled={!cameraReady}
                className={`px-4 py-2 rounded ${
                  cameraReady
                    ? "bg-[#FF6500] hover:bg-orange-600"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Start Recording
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="bg-red-600 px-4 py-2 rounded"
              >
                Stop Recording
              </button>
            )}
          </div>
        </div>

        <div className="w-1/3 space-y-4">
          <div className="bg-[#1E3E62] p-4 rounded-xl">
            <h2 className="font-semibold text-lg mb-2">Connected Devices</h2>
            {devices.map((d) => (
              <div key={d._id} className="py-2 border-b border-gray-700">
                <p className="font-medium">{d.name}</p>
                <p
                  className={`text-sm ${
                    d.status === "online" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Status: {d.status}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-[#1E3E62] p-4 rounded-xl">
            <h2 className="font-semibold text-lg mb-2">Latest Recordings</h2>
            {videos
              .slice(-3)
              .reverse()
              .map((v) => (
                <video
                  key={v._id}
                  src={v.path}
                  controls
                  className="w-full rounded mb-2"
                />
              ))}
            <p className="text-sm mt-2">
              Total: {videos.length} | Storage: {storageUsed.toFixed(2)} MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
