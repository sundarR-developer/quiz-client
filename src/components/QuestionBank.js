// client/src/components/QuestionBank.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function QuestionBank() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ question: '', options: ['', '', ''], answer: 0, type: 'mcq', explanation: '' });
  const [editingId, setEditingId] = useState(null);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios.get('/api/questions').then(res => setQuestions(res.data));
    axios.get('/api/exams').then(res => setExams(res.data));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "answer") {
      setForm(f => ({ ...f, answer: Number(value) }));
    } else if (name === "examId") {
      setForm(f => ({ ...f, examId: value }));
    } else if (name.startsWith('option')) {
      const idx = Number(name.replace('option', ''));
      setForm(f => ({ ...f, options: f.options.map((opt, i) => i === idx ? value : opt) }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation: all options must be non-empty, answer must be a valid index
    if (!form.question.trim() || form.options.some(opt => !opt.trim())) {
      alert('Please fill in the question and all options.');
      return;
    }
    if (isNaN(form.answer) || form.answer < 0 || form.answer >= form.options.length) {
      alert('Please select a valid answer.');
      return;
    }
    const payload = { ...form, options: form.options, type: form.type || 'mcq', explanation: form.explanation || '', examId: form.examId };
    console.log("Submitting question payload:", payload);
    try {
      let res;
      if (editingId) {
        res = await axios.put(`/api/questions/${editingId}`, payload);
      } else {
        res = await axios.post('/api/questions', payload);
        // Automatic assignment: add the new question to the exam's questions array
        const newQuestionId = res.data._id;
        const token = localStorage.getItem('token');
        // Fetch the current exam to get its questions
        const examRes = await axios.get(`/api/exams/${form.examId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const existingQuestionIds = (examRes.data.questions || []).map(q => typeof q === 'string' ? q : q._id);
        // Add the new question's ID
        const updatedQuestionIds = [...existingQuestionIds, newQuestionId];
        // Update the exam's questions array
        await axios.put(
          `/api/exams/${form.examId}/questions`,
          { questionIds: updatedQuestionIds },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        window.location.reload();
      }
      setForm({ question: '', options: ['', '', ''], answer: 0, type: 'mcq', explanation: '' });
      setEditingId(null);
      const questionsRes = await axios.get('/api/questions');
      setQuestions(questionsRes.data);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.msg || err.message);
    }
  };

  const handleEdit = (q) => {
    setForm({
      question: q.question,
      options: q.options,
      answer: q.answer,
      type: q.type || 'mcq',
      explanation: q.explanation || ''
    });
    setEditingId(q._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/questions/${id}`);
    setQuestions(questions.filter(q => q._id !== id));
  };

  return (
    <div className="text-gray-900">
      <h2 className="text-lg font-semibold mb-4">Question Bank</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2 items-center">
        <select
          name="examId"
          value={form.examId || ''}
          onChange={handleChange}
          required
          className="border rounded px-2 py-1 text-gray-900 w-48"
        >
          <option value="">Select Exam</option>
          {exams.map(exam => (
            <option key={exam._id} value={exam._id}>{exam.title}</option>
          ))}
        </select>
        <input name="question" value={form.question} onChange={handleChange} placeholder="Question" required className="border rounded px-2 py-1 text-gray-900 w-72" />
        {form.options.map((opt, i) => (
          <input key={i} name={`option${i}`} value={opt} onChange={handleChange} placeholder={`Option ${i + 1}`} required className="border rounded px-2 py-1 text-gray-900 w-48" />
        ))}
        <select name="answer" value={form.answer} onChange={handleChange} className="border rounded px-2 py-1 text-gray-900 w-32">
          <option value={0}>Option 1</option>
          <option value={1}>Option 2</option>
          <option value={2}>Option 3</option>
        </select>
        <select name="type" value={form.type} onChange={handleChange} className="border rounded px-2 py-1 text-gray-900 w-32">
          <option value="mcq">MCQ</option>
        </select>
        <input name="explanation" value={form.explanation} onChange={handleChange} placeholder="Explanation" className="border rounded px-2 py-1 text-gray-900 w-64" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">{editingId ? 'Update' : 'Add'} Question</button>
      </form>
      <table className="w-full border-collapse bg-white text-gray-900">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b text-left">Question</th>
            <th className="py-2 px-3 border-b text-left">Options</th>
            <th className="py-2 px-3 border-b text-left">Answer</th>
            <th className="py-2 px-3 border-b text-left">Explanation</th>
            <th className="py-2 px-3 border-b text-left">Type</th>
            <th className="py-2 px-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {questions.map(q => (
            <tr key={q._id} className="hover:bg-gray-100">
              <td className="py-2 px-3">{q.question}</td>
              <td className="py-2 px-3">{q.options.join(', ')}</td>
              <td className="py-2 px-3">{q.options[q.answer]}</td>
              <td className="py-2 px-3">{q.explanation}</td>
              <td className="py-2 px-3">{q.type}</td>
              <td className="py-2 px-3">
                <button onClick={() => handleEdit(q)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition mr-1">Edit</button>
                <button onClick={() => handleDelete(q._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default QuestionBank;
