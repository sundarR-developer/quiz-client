import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ExamForm.css';

export default function ExamForm() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const timerRef = useRef();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  const handleSubmit = useCallback(async () => {
    const userId = user?._id;
    setSubmitted(true);
    try {
      const response = await axios.post(
        `https://quiz-server-8.onrender.com/api/result`,
        { examId: id, answers, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate('/result', { state: { resultData: response.data } });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to submit answers. Please try again.');
      setSubmitted(false);
    }
  }, [id, answers, navigate, token, user]);

  // Fetch exam and questions
  useEffect(() => {
    const fetchExam = async () => {
      setLoading(true);
      setError('');

      try {
        const res = await axios.get(
          `https://quiz-server-8.onrender.com/api/exams/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
          }
        );

        const examData = res.data;

        // Permission check
        if (!examData.assignedTo || !examData.assignedTo.map(String).includes(String(user._id))) {
          setError('You are not assigned to this exam.');
          setLoading(false);
          return;
        }

        setExam(examData);
        setQuestions(examData.questions || []);
        setTimer(examData.duration * 60); // minutes to seconds
      } catch (err) {
        console.error('Exam fetch error:', err);
        setError('Failed to load exam. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && token) fetchExam();
    else {
      setError('User not authenticated. Please login again.');
      setLoading(false);
    }
  }, [id, token, user]);

  // Timer
  useEffect(() => {
    if (timer > 0 && !submitted) {
      timerRef.current = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0 && !submitted && questions.length > 0) {
      handleSubmit();
    }
    return () => clearTimeout(timerRef.current);
  }, [timer, submitted, questions.length, handleSubmit]);

  const handleChange = (qid, value) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  };

  // Format timer
  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  // UI: Loading/Error
  if (loading) return <div className="flex justify-center items-center min-h-screen"><span className="text-xl">Loading...</span></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg font-semibold">{error}</div>;
  if (!exam) return <div className="text-center mt-10 text-xl font-semibold">Exam not found.</div>;
  if (questions.length === 0) return <div className="text-center mt-10 text-xl font-semibold">No questions available.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{exam.title}</h2>
        <div className="mb-6 text-lg font-semibold text-blue-700">Time Left: {minutes}:{seconds.toString().padStart(2, '0')}</div>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-6">
          {questions.map((q, idx) => (
            <div key={q._id} className="mb-2 p-4 bg-gray-100 rounded">
              <div className="mb-2 font-semibold">Q{idx + 1}: {q.question}</div>
              {q.options?.length > 0 ? (
                <div className="mt-2">
                  {q.options.map((opt, i) => (
                    <label key={i} className="block mb-2 cursor-pointer">
                      <input
                        type="radio"
                        name={`q_${q._id}`}
                        value={i}
                        checked={answers[q._id] === i}
                        onChange={() => handleChange(q._id, i)}
                        required
                        className="mr-2"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={answers[q._id] || ''}
                  onChange={e => handleChange(q._id, e.target.value)}
                  className="mt-2 w-full border rounded px-3 py-2 text-gray-900"
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitted}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold mt-2"
          >
            Submit Answers
          </button>

          {submitted && <div className="mt-4 text-green-600 font-semibold">Exam submitted! Redirecting...</div>}
        </form>
      </div>
    </div>
  );
}
