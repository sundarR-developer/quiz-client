import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import WebcamCheck from './WebcamCheck';

function ProctoringWrapper({ children }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [warnings, setWarnings] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const MAX_WARNINGS = 3;

  useEffect(() => {
    if (!isVerified) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const newWarningCount = warnings + 1;
        setWarnings(newWarningCount);
        alert(`Warning ${newWarningCount}/${MAX_WARNINGS}: You have switched tabs. The exam will be submitted if you exceed the warning limit.`);
        
        if (newWarningCount >= MAX_WARNINGS) {
          alert('You have exceeded the maximum number of warnings. The exam will be submitted automatically.');
          navigate('/result');
        }
      }
    };

    const handleBlur = () => {
        handleVisibilityChange();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
    };
  }, [warnings, navigate, isVerified]);

  const handleVerification = () => {
    setIsVerified(true);
  };

  useEffect(() => {
    let stream;
    async function enableWebcam() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (!window.localStreams) window.localStreams = [];
        window.localStreams.push(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Webcam access denied or not available.');
      }
    }
    enableWebcam();
    const currentVideo = videoRef.current;
    return () => {
      if (currentVideo && currentVideo.srcObject) {
        currentVideo.srcObject.getTracks().forEach(track => track.stop());
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
        console.log('Webcam stream stopped');
      }
      // Extra safety: force stop all webcams
      if (window.forceStopAllWebcams) window.forceStopAllWebcams();
    };
  }, []);

  // TODO: Add snapshot capture and backend upload logic here

  if (!isVerified) {
    return <WebcamCheck onVerified={handleVerification} />;
  }

  return (
    <div className="relative">
      {/* Webcam overlay */}
      <div className="fixed top-4 right-4 z-50 bg-gray-900 rounded-lg p-2 shadow-lg flex flex-col items-center">
        <video ref={videoRef} autoPlay muted width={160} height={120} className="rounded bg-black" />
        {error && <div className="text-red-500 mt-2 text-sm">{error}</div>}
        {/* TODO: Add snapshot button or periodic capture here */}
      </div>
      {/* Exam content */}
      <div>{children}</div>
    </div>
  );
}

export default ProctoringWrapper; 