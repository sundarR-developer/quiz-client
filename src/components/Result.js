import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Result.css";

export default function Result() {
  useEffect(() => {
    // Try to stop all video tracks from all streams
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices().then(() => {
        if (window.localStreams) {
          window.localStreams.forEach(stream => {
            stream.getTracks().forEach(track => track.stop());
          });
          window.localStreams = [];
        }
        // Try to stop any video elements on the page
        document.querySelectorAll('video').forEach(video => {
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
          }
        });
        // Request and immediately stop a dummy stream to force release
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            stream.getTracks().forEach(track => track.stop());
            console.log('Dummy webcam stream stopped for cleanup');
          })
          .catch(() => {});
      });
    }
    if (window.forceStopAllWebcams) window.forceStopAllWebcams();
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const resultData = location.state && location.state.resultData;

  if (!resultData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-xl bg-white rounded shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">No result data found.</h2>
          <button onClick={() => navigate("/")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold">Go Home</button>
        </div>
      </div>
    );
  }

  console.log("Result data:", resultData);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Result</h1>
        <div className="flex justify-center items-center mb-6">
          <span className="mr-2 font-semibold">Score</span>
          <span className="font-bold">{resultData.score} / {resultData.total}</span>
        </div>
        <h2 className="text-lg font-semibold mb-4">Question Feedback</h2>
        <div>
          {resultData.feedback && resultData.feedback.length > 0 ? (
            resultData.feedback.map((item, idx) => {
              // Convert index to actual answer text
              const getUserAnswerText = () => {
                if (item.userAnswer === null || item.userAnswer === undefined) {
                  return "No answer";
                }
                return item.options && item.options[item.userAnswer] ? item.options[item.userAnswer] : item.userAnswer;
              };
              
              const getCorrectAnswerText = () => {
                if (item.correctAnswer === undefined) {
                  return 'N/A';
                }
                return item.options && item.options[item.correctAnswer] ? item.options[item.correctAnswer] : item.correctAnswer;
              };
              
              return (
                <div key={idx} className="mb-6 p-4 bg-gray-100 rounded">
                  <div className="mb-2 font-semibold">Q{idx + 1}: {item.question}</div>
                  <p className="mb-1"><span className="font-semibold">Your Answer:</span> {getUserAnswerText()}</p>
                  <div className="mb-1"><span className="font-semibold">Correct Answer:</span> {getCorrectAnswerText()}</div>
                  <div className="mb-1"><span className="font-semibold">Explanation:</span> {item.explanation || 'No explanation provided.'}</div>
                  <div><span className="font-semibold">Result:</span> <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>{item.isCorrect ? 'Correct' : 'Incorrect'}</span></div>
                </div>
              );
            })
          ) : (
            <div>No feedback available.</div>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold" to={"/student-dashboard"}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
