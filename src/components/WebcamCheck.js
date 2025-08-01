import React, { useRef, useState, useEffect } from 'react';

const WebcamCheck = ({ onVerified }) => {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    async function getCameraPermission() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasVideoInput = devices.some(device => device.kind === 'videoinput');
        const hasAudioInput = devices.some(device => device.kind === 'audioinput');

        console.log('Available devices:', devices);

        if (!hasVideoInput && !hasAudioInput) {
          setError('No camera or microphone devices found. Please connect at least one.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: hasVideoInput,
          audio: hasAudioInput,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraOn(true);
          setError(null);
        }
      } catch (err) {
        console.error('Error accessing media devices:', err);

        switch (err.name) {
          case 'NotFoundError':
            setError('No camera/mic found. Please connect a device.');
            break;
          case 'NotAllowedError':
            setError('Permission denied. Allow camera/mic access and refresh.');
            break;
          case 'NotReadableError':
            setError('Camera/mic is in use by another application.');
            break;
          default:
            setError('Unable to access camera/mic. Please check your browser settings.');
        }

        setIsCameraOn(false);
      }
    }

    if (navigator.mediaDevices?.getUserMedia) {
      getCameraPermission();
    } else {
      setError('Your browser does not support webcam or microphone access.');
    }
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
          {!isCameraOn && !error && <p className="text-gray-700">Requesting camera access...</p>}
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