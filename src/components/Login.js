import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'https://quiz-server-9.onrender.com/api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, form);

      // Save token and user to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMsg('Login successful! Redirecting...');

      // Redirect based on user role
      setTimeout(() => {
        if (res.data.user && res.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }, 1500);
    } catch (err) {
      setMsg(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded shadow-md p-8 flex flex-col gap-4 text-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border rounded px-3 py-2 text-gray-900" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border rounded px-3 py-2 text-gray-900" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold">Login</button>
        {msg && <div className="mt-2 text-center text-red-600">{msg}</div>}
      </form>
    </div>
  );
}
