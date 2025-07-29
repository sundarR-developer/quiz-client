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

  // Submit handler
  const handleSubmit = useCallback(async () => {
    const userId = user?._id;
    try {
      const response = await axios.post(
        `https://quiz-server-8.onrender.com/api/result`,
        {
          examId: id,
          answers,
          userId
        }
      );
      setSubmitted(true);
      navigate('/result', { state: { resultData: response.data } });
    } catch (err) {
      console.error('Failed to submit answers:', err);
    }
  }, [id, answers, navigate, user]);

  // Fetch exam with retry logic
  const fetchExamWithRetry = useCallback(async () => {
    let retries = 3;
    setLoading(true);
    setError('');

    while (retries > 0) {
      try {
        const response = await axios.get(`https://quiz-server-8.onrender.com/api/exams/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000
        });

        const data = response.data;

        if (!data.assignedTo || !data.assignedTo.map(String).includes(String(user._id))) {
          setError('You are not assigned to this exam.');
          break;
        }

        setExam(data);
        setQuestions(data.questions || []);
        setTimer(data.duration * 60);
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          setError('Failed to fetch exam details. Please try again later.');
        } else {
          await new Promise((res) => setTimeout(res, 3000));
        }
      } finally {
        setLoading(false);
      }
    }
  }, [id, token, user._id]);

  useEffect(() => {
    fetchExamWithRetry();
  }, [fetchExamWithRetry]);

  // Timer logic
  useEffect(() => {
    if (timer > 0 && !submitted) {
      timerRef.current = setTimeout(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0 && !submitted && questions.length > 0) {
      handleSubmit();
    }

    return () => clearTimeout(timerRef.current);
  }, [timer, submitted, questions.length, handleSubmit]);

  const handleChange = (qid, value) => {
    setAnswers({ ...answers, [qid]: value });
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen"><span className="text-gray-900 text-xl font-semibold">Loading...</span></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><span className="text-red-500 text-xl font-semibold">{error}</span></div>;
  if (!exam) return <div className="flex justify-center items-center min-h-screen"><span className="text-gray-900 text-xl font-semibold">Exam not found.</span></div>;
  if (!questions.length) return <div className="flex justify-center items-center min-h-screen"><span className="text-gray-900 text-xl font-semibold">No questions found for this exam.</span></div>;

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow-md p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">{exam.title}</h2>
        <div className="mb-6 text-lg font-semibold text-blue-700"><b>Time Left:</b> {minutes}:{seconds.toString().padStart(2, '0')}</div>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="flex flex-col gap-6">
          {questions.map((q, idx) => (
            <div key={q._id} className="mb-2 p-4 bg-gray-100 rounded">
              <div className="mb-2 font-semibold">Q{idx + 1}: {q.question}</div>
              {q.options && q.options.length > 0 ? (
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
          <button type="submit" disabled={submitted} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold mt-2">Submit Answers</button>
        </form>
        {submitted && <div className="mt-4 text-green-600 font-semibold">Exam submitted! Redirecting...</div>}
      </div>
    </div>
  );
}
