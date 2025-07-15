import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import QuestionBank from './QuestionBank';
import UserManagement from './UserManagement';
import ExamManagement from './ExamManagement';
import ResultsAnalysis from './ResultsAnalysis';

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get('tab') || 'userManagement';
  const [activeTab, setActiveTab] = useState(initialTab); // default tab

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-6">
      <div className="w-full max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl mx-auto bg-white rounded shadow-md p-2 sm:p-4 md:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 text-center">Welcome, {user?.name} <span className="text-blue-600">(admin)</span>!</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-8 items-stretch">
          <button
            onClick={() => setActiveTab('userManagement')}
            className={`w-full sm:w-auto px-4 py-2 rounded font-semibold transition ${activeTab === 'userManagement' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('examManagement')}
            className={`w-full sm:w-auto px-4 py-2 rounded font-semibold transition ${activeTab === 'examManagement' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
          >
            Exam Management
          </button>
          <button
            onClick={() => setActiveTab('questionBank')}
            className={`w-full sm:w-auto px-4 py-2 rounded font-semibold transition ${activeTab === 'questionBank' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
          >
            Question Bank
          </button>
          <button
            onClick={() => setActiveTab('resultsAnalysis')}
            className={`w-full sm:w-auto px-4 py-2 rounded font-semibold transition ${activeTab === 'resultsAnalysis' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
          >
            Results/Analysis
          </button>
          <button
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
        <div className="bg-gray-50 rounded p-2 sm:p-4 min-h-[200px] sm:min-h-[300px]">
          {activeTab === 'userManagement' && <UserManagement />}
          {activeTab === 'examManagement' && <ExamManagement />}
          {activeTab === 'questionBank' && <QuestionBank />}
          {activeTab === 'resultsAnalysis' && <ResultsAnalysis />}
        </div>
      </div>
    </div>
  );
} 