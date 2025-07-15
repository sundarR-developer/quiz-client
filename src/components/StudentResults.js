import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StudentResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/results/${userId}`)
      .then(res => {
        setResults(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch results. Please try again later.');
        setResults([]);
        setLoading(false);
      });
  }, [userId, navigate]);

  if (selectedResult) {
    // Detailed feedback view (reuse Result.js logic inline)
    const resultData = selectedResult;
    return (
      <div className="max-w-2xl mx-auto bg-white text-gray-900 rounded shadow-md p-8 mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Result</h1>
        <div className="flex justify-center items-center mb-6">
          <span className="mr-2 font-semibold">Score</span>
          <span className="font-bold">{resultData.score} / {resultData.total}</span>
        </div>
        <h2 className="text-lg font-semibold mb-4">Question Feedback</h2>
        <div>
          {resultData.feedback && resultData.feedback.length > 0 ? (
            resultData.feedback.map((item, idx) => (
              <div key={idx} className="mb-6 p-4 bg-gray-100 rounded">
                <div className="mb-2 font-semibold">Q{idx + 1}: {item.question}</div>
                <p className="mb-1"><span className="font-semibold">Your Answer:</span> {item.userAnswer !== null && item.userAnswer !== undefined ? item.userAnswer : "No answer"}</p>
                <div className="mb-1"><span className="font-semibold">Correct Answer:</span> {item.correctAnswer !== undefined ? String(item.correctAnswer) : 'N/A'}</div>
                <div className="mb-1"><span className="font-semibold">Explanation:</span> {item.explanation || 'No explanation provided.'}</div>
                <div><span className="font-semibold">Result:</span> <span className={item.isCorrect ? 'text-green-600' : 'text-red-600'}>{item.isCorrect ? 'Correct' : 'Incorrect'}</span></div>
              </div>
            ))
          ) : (
            <div>No feedback available.</div>
          )}
        </div>
        <div className="flex justify-center mt-6">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick={() => setSelectedResult(null)}>
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white text-gray-900 rounded shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">My Results History</h2>
      {loading ? (
        <div className="flex justify-center items-center my-8">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600" />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center mb-4">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-gray-400 text-center mb-4">No results found yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4">Exam</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {results.map(result => (
                <tr key={result._id} className="border-b hover:bg-blue-50 cursor-pointer transition">
                  <td className="py-3 px-4">{result.exam?.title || 'Untitled Exam'}</td>
                  <td className="py-3 px-4">{result.date ? new Date(result.date).toLocaleString() : ''}</td>
                  <td className="py-3 px-4">{result.score} / {result.total}</td>
                  <td className="py-3 px-4">
                    <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition" onClick={() => setSelectedResult(result)}>
                      View Feedback
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition" onClick={() => navigate('/student-dashboard')}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
