import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    if (role !== 'student') {
      navigate('/not-authorized');
    } else {
      setLoading(true);
      setError('');
      axios.get(`https://quiz-server-8.onrender.com/api/my-exams`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        setExams(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch assigned exams. Please try again later.');
        setExams([]);
        setLoading(false);
      });
    }
  }, [role, navigate, token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded shadow-md p-8 relative">
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => navigate('/student-results')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            My Results
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">My Assigned Exams</h2>
        {loading ? (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center mb-4">{error}</div>
        ) : exams.length === 0 ? (
          <div className="text-gray-400 text-center mb-4">No exams assigned yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr
                    key={exam._id}
                    className="border-b hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => navigate(`/exam/${exam._id}`)}
                  >
                    <td className="py-3 px-4">{exam.title}</td>
                    <td className="py-3 px-4">{exam.description}</td>
                    <td className="py-3 px-4">{exam.scheduledFor ? new Date(exam.scheduledFor).toLocaleDateString('en-GB') : ''}</td>
                    <td className="py-3 px-4">{exam.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
