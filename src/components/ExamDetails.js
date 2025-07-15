import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ExamDetails() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/exams/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (
          !res.data.assignedTo ||
          !res.data.assignedTo
            .map(id => (id && typeof id.toString === 'function' ? id.toString() : null))
            .filter(Boolean)
            .includes(user._id.toString())
        ) {
          setError('You are not assigned to this exam.');
          setLoading(false);
          return;
        }
        setExam(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch exam details.');
        setLoading(false);
      });
  }, [id, token, user._id]);

  // Debug: log assignedTo and user._id
  if (exam) {
    console.log('assignedTo:', exam.assignedTo, 'user._id:', user && user._id);
    console.log('ExamDetails id from useParams:', id, 'exam._id:', exam && exam._id);
    // Debug log for exam._id
    console.log('Exam _id before Start Exam button:', exam._id);
  }
  // Only allow if student is assigned
  if (
    exam &&
    Array.isArray(exam.assignedTo) &&
    !exam.assignedTo
      .map(id => {
        if (!id) return null;
        if (typeof id === 'string') return id;
        if (typeof id === 'object' && id !== null && typeof id.toString === 'function') return id.toString();
        return null;
      })
      .filter(Boolean)
      .includes(user && user._id ? user._id.toString() : '')
  ) {
    return <div className="text-gray-900 text-center mt-8">You are not assigned to this exam.</div>;
  }

  if (loading) return <div className="text-gray-900 text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!exam) return null;

  return (
    <div className="max-w-xl mx-auto bg-white text-gray-900 rounded shadow-md p-8 mt-8">
      <h2 className="text-2xl font-bold mb-4">{exam.title}</h2>
      <p className="mb-2"><span className="font-semibold">Description:</span> {exam.description}</p>
      <p className="mb-2"><span className="font-semibold">Date:</span> {exam.scheduledFor ? new Date(exam.scheduledFor).toLocaleDateString('en-GB') : ''}</p>
      <p className="mb-4"><span className="font-semibold">Duration:</span> {exam.duration} min</p>
      <button onClick={() => { navigate(`/exam/${exam._id}/take`); }} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full font-semibold">Start Exam</button>
    </div>
  );
}
