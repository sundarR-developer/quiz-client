import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', duration: '' });
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestionSelector, setShowQuestionSelector] = useState(false);
  const [students, setStudents] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignExam, setAssignExam] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);

  const fetchExams = () => {
    axios.get('/api/exams').then(res => setExams(res.data));
  };

  useEffect(() => {
    fetchExams();
    axios.get('/api/questions').then(res => setQuestions(res.data));
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setStudents(res.data.filter(u => u.role === 'student'));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleAddExam = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      scheduledFor: form.date,
      duration: form.duration,
      questions: []
    };
    const res = await axios.post('/api/exams', payload);
    setExams([...exams, res.data]);
    setForm({ title: '', description: '', date: '', duration: '' });
    fetchExams(); // Refresh exams after adding a new one
  };

  const handleOpenQuestionSelector = (exam) => {
    setSelectedExam(exam);
    // Ensure selectedQuestions is an array of IDs (not objects)
    setSelectedQuestions(
      (exam.questions || []).map(q => typeof q === 'string' ? q : q._id)
    );
    setShowQuestionSelector(true);
  };

  const handleQuestionToggle = (qid) => {
    setSelectedQuestions(qs =>
      qs.includes(qid) ? qs.filter(id => id !== qid) : [...qs, qid]
    );
  };

  const handleSaveQuestions = async () => {
    const token = localStorage.getItem('token'); // or sessionStorage.getItem('token')
    await axios.put(
      `/api/exams/${selectedExam._id}/questions`,
      { questionIds: selectedQuestions },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setExams(exams.map(exam =>
      exam._id === selectedExam._id ? { ...exam, questions: selectedQuestions } : exam
    ));
    setShowQuestionSelector(false);
    setSelectedExam(null);
    setSelectedQuestions([]);
    fetchExams(); // Refresh exams after saving questions
  };

  const handleOpenAssignModal = (exam) => {
    setAssignExam(exam);
    setSelectedStudents([]); // Optionally prefill with already assigned students
    setShowAssignModal(true);
  };

  return (
    <div className="text-gray-900">
      <h2 className="text-lg font-semibold mb-4">Exam Management</h2>
      <form onSubmit={handleAddExam} className="mb-4 flex flex-wrap gap-2 items-center">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required className="border rounded px-2 py-1 text-gray-900" />
        <input name="description" value={form.description} onChange={handleChange} placeholder="Description" required className="border rounded px-2 py-1 text-gray-900" />
        <input name="date" type="date" value={form.date} onChange={handleChange} required className="border rounded px-2 py-1 text-gray-900" />
        <input name="duration" type="number" value={form.duration} onChange={handleChange} placeholder="Duration (min)" required className="border rounded px-2 py-1 text-gray-900" />
        <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Add Exam</button>
      </form>
      <table className="w-full border-collapse bg-white text-gray-900">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b text-left">Title</th>
            <th className="py-2 px-3 border-b text-left">Description</th>
            <th className="py-2 px-3 border-b text-left">Date</th>
            <th className="py-2 px-3 border-b text-left">Duration</th>
            <th className="py-2 px-3 border-b text-left">Questions</th>
            <th className="py-2 px-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam._id} className="hover:bg-gray-100">
              <td className="py-2 px-3">{exam.title}</td>
              <td className="py-2 px-3">{exam.description}</td>
              <td className="py-2 px-3">{exam.scheduledFor ? new Date(exam.scheduledFor).toLocaleDateString() : ''}</td>
              <td className="py-2 px-3">{exam.duration} min</td>
              <td className="py-2 px-3">{exam.questions ? exam.questions.length : 0}</td>
              <td className="py-2 px-3">
                <button onClick={() => handleOpenQuestionSelector(exam)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition mr-1">Add Questions</button>
                <button onClick={() => handleOpenAssignModal(exam)} className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition">Assign</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showQuestionSelector && (
        <div className="bg-gray-100 text-gray-900 p-4 mt-4 rounded">
          <h3 className="font-semibold mb-2">Select Questions for Exam: {selectedExam.title}</h3>
          {questions.map(q => (
            <div key={q._id} className="mb-1">
              <label>
                <input
                  type="checkbox"
                  checked={selectedQuestions.includes(q._id)}
                  onChange={() => handleQuestionToggle(q._id)}
                  className="mr-2"
                />
                {q.question}
              </label>
            </div>
          ))}
          <button onClick={handleSaveQuestions} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2 mt-2">Save Questions</button>
          <button onClick={() => setShowQuestionSelector(false)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition mt-2">Cancel</button>
        </div>
      )}
      {showAssignModal && (
        <div className="bg-gray-100 text-gray-900 p-4 mt-4 rounded">
          <h3 className="font-semibold mb-2">Assign Exam: {assignExam.title}</h3>
          {students.map(student => (
            <div key={student._id} className="mb-1">
              <label>
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student._id)}
                  onChange={() => {
                    setSelectedStudents(selectedStudents =>
                      selectedStudents.includes(student._id)
                        ? selectedStudents.filter(id => id !== student._id)
                        : [...selectedStudents, student._id]
                    );
                  }}
                  className="mr-2"
                />
                {student.name} ({student.email})
              </label>
            </div>
          ))}
          <button onClick={async () => {
            const token = localStorage.getItem('token');
            await axios.post(
              `/api/exams/${assignExam._id}/assign`,
              { studentIds: selectedStudents },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowAssignModal(false);
            setAssignExam(null);
            setSelectedStudents([]);
          }} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2 mt-2">Assign</button>
          <button onClick={() => setShowAssignModal(false)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition mt-2">Cancel</button>
        </div>
      )}
    </div>
  );
}

export default ExamManagement; 