import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServerData } from '../helper/helper';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../styles/AnalysisDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalysisDashboard = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [exam, setExam] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        // Fetch both exam details and analysis data
        const examData = await getServerData(`https://quiz-server-9.onrender.com/api/exams/${examId}`);
        const analysisData = await getServerData(`https://quiz-server-9.onrender.com/api/exams/${examId}/analysis`);
        setExam(examData);
        setAnalysis(analysisData);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [examId]);

  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><h3 className="text-gray-900 text-xl font-semibold">Loading analysis...</h3></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen"><h3 className="text-red-500 text-xl font-semibold">Error fetching analysis: {error.message}</h3></div>;
  if (!analysis || !exam || analysis.participantCount === 0) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
          <div className="w-full max-w-2xl bg-white rounded shadow-md p-8">
            <button onClick={() => navigate('/admin-dashboard?tab=resultsAnalysis')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold mb-6">Back to Results/Analysis</button>
            <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">Analysis for: {exam?.title || 'Exam'}</h1>
            <h3 className="text-gray-700 text-center mt-8">No results found for this exam yet.</h3>
          </div>
        </div>
      )
  }

  const scoreData = {
      labels: analysis.rawResults.map(r => r.user?.name || r.user?.email || 'Unknown'),
      datasets: [{
          label: 'Scores',
          data: analysis.rawResults.map(r => r.score),
          backgroundColor: 'rgba(13, 255, 146, 0.6)',
          borderColor: 'rgba(13, 255, 146, 1)',
          borderWidth: 1,
      }]
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Score Distribution per Participant',
        color: '#000000',
        font: { size: 18 }
      },
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: { color: '#f0f0f0' },
            grid: { color: '#444' }
        },
        x: {
            ticks: { color: '#f0f0f0' },
            grid: { color: '#444' }
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-5xl bg-white rounded shadow-md p-8">
        <button onClick={() => navigate('/admin-dashboard?tab=resultsAnalysis')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold mb-6">Back to Results/Analysis</button>
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Analysis for: {exam.title}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-100 rounded p-4 text-center">
            <h4 className="font-semibold mb-1">Participants</h4>
            <p className="text-xl font-bold">{analysis.participantCount}</p>
          </div>
          <div className="bg-gray-100 rounded p-4 text-center">
            <h4 className="font-semibold mb-1">Average Score</h4>
            <p className="text-xl font-bold">{analysis.averageScore === null || isNaN(analysis.averageScore) ? 'N/A' : analysis.averageScore}</p>
          </div>
          <div className="bg-gray-100 rounded p-4 text-center">
            <h4 className="font-semibold mb-1">Highest Score</h4>
            <p className="text-xl font-bold">{analysis.highestScore === null || isNaN(analysis.highestScore) ? 'N/A' : analysis.highestScore}</p>
          </div>
          <div className="bg-gray-100 rounded p-4 text-center">
            <h4 className="font-semibold mb-1">Lowest Score</h4>
            <p className="text-xl font-bold">{analysis.lowestScore === null || isNaN(analysis.lowestScore) ? 'N/A' : analysis.lowestScore}</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded p-4 mb-8">
          <Bar options={chartOptions} data={scoreData} />
        </div>
        <h2 className="text-xl font-semibold mb-4 text-gray-900 mt-8">Individual Results</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse bg-white text-gray-900">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Points Earned</th>
                <th className="py-3 px-4">Attempted</th>
                <th className="py-3 px-4">Result</th>
              </tr>
            </thead>
            <tbody>
              {analysis.rawResults.map(result => (
                <tr key={result._id} className="border-b hover:bg-blue-50 cursor-pointer transition">
                  <td className="py-3 px-4">{result.user?.name || result.user?.email || 'Unknown'}</td>
                  <td className="py-3 px-4">{result.score}</td>
                  <td className="py-3 px-4">{result.total}</td>
                  <td className="py-3 px-4">{result.score === result.total ? 'Pass' : 'Fail'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard; 
