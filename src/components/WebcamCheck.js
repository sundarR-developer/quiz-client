import React, { useRef, useState, useEffect } from 'react';

const WebcamCheck = ({ onVerified }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    async function getCameraPermission() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          // Optional: log devices for debugging
          const devices = await navigator.mediaDevices.enumerateDevices();
          console.log("Available media devices:");
          devices.forEach(device => {
            console.log(`${device.kind}: ${device.label} (${device.deviceId})`);
          });

          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsCameraOn(true);
            setError(null);
          }
        } catch (err) {
          console.error("Error accessing camera:", err);

          if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
            setError("No camera or microphone device was found. Please ensure they are connected and enabled.");
          } else if (err.name === 'NotAllowedError') {
            setError("Camera and microphone access was denied. Please allow access and refresh the page.");
          } else if (err.name === 'NotReadableError') {
            setError("Your camera or microphone might be in use by another application.");
          } else {
            setError("Webcam and microphone access is required for proctoring. Please enable permissions in your browser settings and refresh the page.");
          }

          setIsCameraOn(false);
        }
      } else {
        setError("Your browser does not support the necessary features for proctoring.");
      }
    }

    getCameraPermission();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 border-2 border-green-400 rounded p-2">
          Webcam & Microphone Check
        </h1>
        <div className="bg-gray-100 rounded p-6 text-center">
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <video
            ref={videoRef}
            className={`w-full max-w-lg h-auto border-2 border-gray-400 rounded mb-4 mx-auto ${isCameraOn ? 'block' : 'hidden'}`}
            autoPlay
            muted
          />
          {!isCameraOn && !error && (
            <p className="text-gray-700">Requesting camera access...</p>
          )}
          {isCameraOn && (
            <>
              <p className="text-green-700 mb-4">
                Your camera and microphone are active. The exam will be proctored.
              </p>
              <div className="pt-4">
                <button
                  onClick={onVerified}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold"
                >
                  Start Exam
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebcamCheck;
