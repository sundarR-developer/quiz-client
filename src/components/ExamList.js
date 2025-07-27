import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServerData, deleteServerData } from '../helper/helper';
import '../styles/ExamList.css';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    try {
      setIsLoading(true);
      const data = await getServerData(`https://quiz-server-8.onrender.com/api/exams`);
      setExams(data);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(examId) {
    if (window.confirm('Are you sure you want to delete this exam?')) {
      try {
        await deleteServerData(`https://quiz-server-8.onrender.com/api/exams/${examId}`);
        fetchExams();
      } catch (err) {
        alert('Failed to delete exam.');
      }
    }
  }

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><h3 className="text-gray-900 text-xl font-semibold">Loading exams...</h3></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><h3 className="text-red-500 text-xl font-semibold">Error fetching exams: {error.message}</h3></div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Scheduled Exams</h1>
        <div className="flex justify-center mb-6">
          <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold" to="/exams/new">Create New Exam</Link>
        </div>
        <ul className="flex flex-col gap-6">
          {exams.length === 0 ? (
            <li className="text-gray-500 text-center">No exams scheduled yet.</li>
          ) : (
            exams.map(exam => (
              <li key={exam._id} className="bg-gray-100 rounded shadow p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div className="flex flex-col gap-2 mb-2 md:mb-0">
                    <span className="text-gray-700">Attend all questions</span>
                    <span className="text-gray-700"><strong>Duration:</strong> {exam.duration} minutes</span>
                    <span className="text-gray-700"><strong>Questions:</strong> {exam.questions.length}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Link to={`/quiz/start/${exam._id}`} className="text-blue-700 font-bold text-lg hover:underline">{exam.title}</Link>
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded text-xs font-semibold">{new Date(exam.scheduledFor).toLocaleString()}</span>
                  </div>
                </div>
                <div className="mb-2 text-gray-700">{exam.description}</div>
                <div className="flex gap-2 mt-2">
                  <Link to={`/exams/${exam._id}/analysis`} className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition font-semibold">View Analysis</Link>
                  <Link to={`/exams/edit/${exam._id}`} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition font-semibold">Edit</Link>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-semibold" onClick={() => handleDelete(exam._id)}>Delete</button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
} 
