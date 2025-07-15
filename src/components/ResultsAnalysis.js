import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResultsAnalysis() {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/exams').then(res => setExams(res.data));
  }, []);

  return (
    <div className="text-gray-900">
      <h2 className="text-lg font-semibold mb-4">Results / Analysis</h2>
      <table className="w-full border-collapse bg-white text-gray-900">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b text-left">Title</th>
            <th className="py-2 px-3 border-b text-left">Description</th>
            <th className="py-2 px-3 border-b text-left">Date</th>
            <th className="py-2 px-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam._id} className="hover:bg-gray-100">
              <td className="py-2 px-3">{exam.title}</td>
              <td className="py-2 px-3">{exam.description}</td>
              <td className="py-2 px-3">{exam.scheduledFor ? new Date(exam.scheduledFor).toLocaleDateString() : ''}</td>
              <td className="py-2 px-3">
                <button onClick={() => navigate(`/exams/${exam._id}/analysis`)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">View Analysis</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsAnalysis; 