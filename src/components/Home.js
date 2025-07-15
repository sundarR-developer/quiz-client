import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  const handleAccountClick = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded shadow-md p-8 flex flex-col items-center">
        <img src="/exam.webp" alt="Exam Logo" className="w-20 h-20 mb-4 rounded shadow" />
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Online Exam Portal</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold mb-6" onClick={handleAccountClick}>My Account</button>
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Welcome to the Online Exam Portal</h2>
        <p className="text-gray-700 text-center">Take exams, manage users, and more. Please log in to continue.</p>
      </div>
    </div>
  );
} 