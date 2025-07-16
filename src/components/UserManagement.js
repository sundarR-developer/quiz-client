import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [msg, setMsg] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', password: '', role: 'student' });

  const token = localStorage.getItem('token');

  const fetchUsers = useCallback(() => {
    axios.get(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/users`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [token]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/users`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('User created!');
      setForm({ name: '', email: '', password: '', role: 'student' });
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  const startEdit = (user) => {
    setEditingId(user._id);
    setEditForm({ name: user.name, email: user.email, password: '', role: user.role });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/users/${id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('User updated!');
      setEditingId(null);
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_SERVER_HOSTNAME}/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMsg('User deleted!');
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <div className="text-gray-900">
      <h3 className="text-lg font-semibold mb-4">User Management</h3>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2 items-center">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required autoComplete='off' className="border rounded px-2 py-1 text-gray-900" />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required autoComplete='off' className="border rounded px-2 py-1 text-gray-900" />
        <input name="password" placeholder="Password" type="password" value={form.password} onChange={handleChange} required autoComplete='new-password' className="border rounded px-2 py-1 text-gray-900" />
        <select name="role" value={form.role} onChange={handleChange} className="border rounded px-2 py-1 text-gray-900">
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Add User</button>
      </form>
      <div className="mb-2 text-sm text-gray-700">{msg}</div>
      <table className="w-full border-collapse bg-white text-gray-900">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b text-left">Name</th>
            <th className="py-2 px-3 border-b text-left">Email</th>
            <th className="py-2 px-3 border-b text-left">Role</th>
            <th className="py-2 px-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-100">
              <td className="py-2 px-3">
                {editingId === user._id ? (
                  <input name="name" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} className="border rounded px-2 py-1 text-gray-900" />
                ) : user.name}
              </td>
              <td className="py-2 px-3">
                {editingId === user._id ? (
                  <input name="email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="border rounded px-2 py-1 text-gray-900" />
                ) : user.email}
              </td>
              <td className="py-2 px-3">
                {editingId === user._id ? (
                  <>
                    <input name="password" type="password" placeholder="New password" value={editForm.password} onChange={e => setEditForm({ ...editForm, password: e.target.value })} className="border rounded px-2 py-1 text-gray-900" />
                    <select name="role" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })} className="border rounded px-2 py-1 text-gray-900">
                      <option value="student">Student</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button type="button" onClick={() => handleUpdate(user._id)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition ml-1">Save</button>
                    <button type="button" onClick={() => setEditingId(null)} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500 transition ml-1">Cancel</button>
                  </>
                ) : user.role}
              </td>
              <td className="py-2 px-3">
                {editingId !== user._id && (
                  <>
                    <button onClick={() => startEdit(user)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition mr-1">Edit</button>
                    <button onClick={() => handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
