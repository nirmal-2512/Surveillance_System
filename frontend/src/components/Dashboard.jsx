import { useEffect, useState, useRef } from "react";

import { Camera, Video, Dot } from "lucide-react";

export default function Dashboard() {
  const [recording, setRecording] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const videoRef = useRef(null);
  const recordedChunks = useRef([]);
  const [devices, setDevices] = useState([]);
  const [videos, setVideos] = useState([]);
  const [totalStorage, setTotalStorage] = useState(0);

  const fetchDevices = async () => {
    const res = await fetch("/api/devices", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setDevices(data);
  };

  const fetchVideos = async () => {
    const res = await fetch("/api/videos", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setVideos(data);

    // Example: Calculate total storage (assuming ~50MB/video or store size in video)

    useEffect(() => {
      fetchDevices();
      fetchVideos();
    }, []);
    const sizePerVideoMB = 50;
    setTotalStorage(data.length * sizePerVideoMB);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    streamRef.current = stream;
    videoRef.current.srcObject = stream;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) recordedChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoURL(url);
      recordedChunks.current = [];
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    streamRef.current.getTracks().forEach((track) => track.stop());
    setRecording(false);
  };

  return (
    <div className="p-4 text-white flex flex-col text-center justify-center text-center">
      <h1 className="text-3xl font-bold mb-6 self-center w-fit">Dashboard</h1>
      <div className="w-full flex">
        <section className="mb-6 flex flex-col w-1/2 justify-center">
          <h2 className="text-2xl mb-2">Connected Devices</h2>
          <ul className="bg-[#0B192C] p-4 rounded">
            {devices.map((device) => (
              <li key={device._id} className="mb-2 flex justify-between">
                <span>{device.name}</span>
                <span
                  className={
                    device.status === "online"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {device.status}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6 flex flex-col w-1/2">
          <h2 className="text-2xl mb-2">Recorded Videos</h2>
          <p className="mb-2">Total Videos: {videos.length}</p>
          <p className="mb-4">Estimated Storage Used: {totalStorage} MB</p>

          <ul className="bg-[#0B192C] p-4 rounded space-y-3">
            {videos.map((video) => (
              <li key={video._id} className="border-b pb-2">
                <p>Device: {video.device?.name || "N/A"}</p>
                <p>Recorded at: {new Date(video.timestamp).toLocaleString()}</p>
                <video
                  src={video.url}
                  controls
                  className="mt-2 w-full max-w-md rounded"
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="p-4 text-white">
        <h2 className="text-xl mb-4">Live Camera Feed & Recording</h2>

        <video
          ref={videoRef}
          autoPlay
          className="w-full h-64 bg-black mb-4 rounded-xl"
        />

        <div className="space-x-2">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-[#FF6500] px-4 py-2 rounded"
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

        {videoURL && (
          <div className="mt-4">
            <h3 className="mb-2">Recorded Video:</h3>
            <video src={videoURL} controls className="w-full rounded-lg" />
          </div>
        )}
      </div>
    </div>
  );
}
