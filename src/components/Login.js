import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setForm({ email: '', password: '' });
    setMsg('');
    if (onLogin) onLogin(null);
  }, [onLogin]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(''); // Clear previous messages

    try {
      console.log('Sending login data:', form); // Debug

      const res = await axios.post(
        `https://quiz-server-8.onrender.com/api/auth/login`,
        form
      );

      console.log('Login response:', res.data);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMsg('Login successful!');
      if (onLogin) onLogin(res.data.user);

      // Redirect based on role
      if (res.data.user.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (err) {
      console.error('Login error:', err);
      if (err.response) {
        if (err.response.status === 400) {
          setMsg('Bad request. Please check your input.');
        } else if (err.response.status === 401 || err.response.status === 403) {
          setMsg('Access denied: Invalid credentials or insufficient permissions.');
        } else {
          setMsg(err.response.data?.msg || 'Server error occurred.');
        }
      } else {
        setMsg('Network error: Unable to reach the server.');
      }
    }
  };

  const handleNewAccount = () => {
    navigate('/register');
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality coming soon!');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMsg('Logged out.');
    if (onLogin) onLogin(null);
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 text-gray-900" style={{ backgroundColor: '#f3f4f6', color: '#1f2937' }}>
      <div className="bg-white p-10 rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md flex flex-col items-center">
        <img src="/exam.webp" alt="Exam Logo" className="w-20 h-20 mb-4 rounded shadow" />
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 tracking-tight">
          Sign in to your account
        </h2>
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5 w-full">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="off"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50 placeholder-gray-400"
          />
          <input
            name="password"
            type="text"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-gray-50 placeholder-gray-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="flex justify-between mt-4 w-full">
          <button type="button" onClick={handleForgotPassword} className="text-blue-600 hover:underline text-sm">
            Forgot password?
          </button>
          <button type="button" onClick={handleNewAccount} className="text-blue-600 hover:underline text-sm">
            New account
          </button>
        </div>

        {msg && (
          <div className={`mt-6 w-full text-center px-4 py-2 rounded-lg font-semibold ${msg.toLowerCase().includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg}
          </div>
        )}

        {user && (
          <div className="mt-8 p-4 bg-gray-50 rounded-lg w-full text-center">
            <p className="mb-2 text-gray-700">
              Logged in as: <span className="font-semibold">{user.name}</span> ({user.role})
            </p>
            {user.role === 'admin' && (
              <button className="mb-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
                Create Exam (Admin Only)
              </button>
            )}
            <button onClick={handleLogout} className="w-full bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
