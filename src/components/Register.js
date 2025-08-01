import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setMsg(''); // Clear previous messages
    try {
      const res = await axios.post(`https://quiz-server-9.onrender.com/api/auth/register`, form);

      // --- Success Logic --- 
      // Save token and user to localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setMsg('Registration successful! Logging you in...');

      // Redirect based on user role
      setTimeout(() => {
        if (res.data.user && res.data.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }, 1500);

    } catch (err) {
      // --- Error Logic ---
      setMsg(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white rounded shadow-md p-8 flex flex-col gap-4 text-gray-900">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <input name="name" placeholder="Name" onChange={handleChange} required className="border rounded px-3 py-2 text-gray-900" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required className="border rounded px-3 py-2 text-gray-900" />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required className="border rounded px-3 py-2 text-gray-900" />
        <select name="role" onChange={handleChange} className="border rounded px-3 py-2 text-gray-900">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold">Register</button>
        {msg && <div className="mt-2 text-center text-green-600">{msg}</div>}
      </form>
    </div>
  );
}