import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProctoringManagement() {
  const [exams, setExams] = useState([]);
  const [proctors, setProctors] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedProctors, setSelectedProctors] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [incidentExam, setIncidentExam] = useState(null);
  const [incidents, setIncidents] = useState([]); // Placeholder for incidents

  useEffect(() => {
    // Fetch all exams
    axios.get('/api/exams').then(res => setExams(res.data));
    // Fetch all proctors (users with role 'proctor')
    axios.get('/api/users', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setProctors(res.data.filter(u => u.role === 'proctor'));
    });
  }, []);

  // Handler to open proctor assignment modal
  const handleOpenAssignModal = (exam) => {
    setSelectedExam(exam);
    setSelectedProctors(exam.proctors || []); // exam.proctors should be an array of proctor IDs
    setShowAssignModal(true);
  };

  // Handler to assign proctors to an exam (TODO: implement backend integration)
  const handleAssignProctors = async () => {
    // TODO: Send selectedProctors to backend to update exam's proctors
    setShowAssignModal(false);
    setSelectedExam(null);
    setSelectedProctors([]);
    // Optionally refetch exams
  };

  // Handler to view incidents for an exam (TODO: implement backend integration)
  const handleViewIncidents = (exam) => {
    setIncidentExam(exam);
    // TODO: Fetch incidents/logs for this exam from backend
    setIncidents([ // Placeholder data
      { id: 1, type: 'Suspicious Activity', description: 'Student looked away from screen multiple times.' },
      { id: 2, type: 'Multiple Faces Detected', description: 'Another person appeared in webcam.' }
    ]);
  };

  return (
    <div className="text-gray-900">
      <h2 className="text-lg font-semibold mb-2">Proctoring Management</h2>
      <h3 className="text-md font-semibold mb-4">Exam Proctor Assignments</h3>
      <table className="w-full border-collapse bg-white text-gray-900 mb-6">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b text-left">Exam</th>
            <th className="py-2 px-3 border-b text-left">Proctors Assigned</th>
            <th className="py-2 px-3 border-b text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam._id} className="hover:bg-gray-100">
              <td className="py-2 px-3">{exam.title}</td>
              <td className="py-2 px-3">
                {(exam.proctors || []).length > 0
                  ? exam.proctors.map(pid => {
                      const p = proctors.find(pr => pr._id === pid);
                      return p ? p.name : 'Unknown';
                    }).join(', ')
                  : 'None'}
              </td>
              <td className="py-2 px-3">
                <button onClick={() => handleOpenAssignModal(exam)} className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition mr-2">Assign Proctors</button>
                <button onClick={() => handleViewIncidents(exam)} className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition">View Incidents</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Assign Proctors Modal */}
      {showAssignModal && (
        <div className="bg-gray-100 text-gray-900 p-4 mt-4 rounded shadow-md max-w-md mx-auto">
          <h4 className="font-semibold mb-2">Assign Proctors for: {selectedExam.title}</h4>
          {proctors.length === 0 ? <p>No proctors available.</p> : proctors.map(proctor => (
            <div key={proctor._id} className="mb-1">
              <label>
                <input
                  type="checkbox"
                  checked={selectedProctors.includes(proctor._id)}
                  onChange={() => {
                    setSelectedProctors(selectedProctors =>
                      selectedProctors.includes(proctor._id)
                        ? selectedProctors.filter(id => id !== proctor._id)
                        : [...selectedProctors, proctor._id]
                    );
                  }}
                  className="mr-2"
                />
                {proctor.name} ({proctor.email})
              </label>
            </div>
          ))}
          <button onClick={handleAssignProctors} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition mr-2 mt-2">Save</button>
          <button onClick={() => setShowAssignModal(false)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition mt-2">Cancel</button>
        </div>
      )}
      {/* Proctoring Incidents Modal/Section */}
      {incidentExam && (
        <div className="bg-gray-100 text-gray-900 p-4 mt-4 rounded shadow-md max-w-md mx-auto">
          <h4 className="font-semibold mb-2">Proctoring Incidents for: {incidentExam.title}</h4>
          {incidents.length === 0 ? <p>No incidents reported.</p> : (
            <ul className="mb-2">
              {incidents.map(inc => (
                <li key={inc.id}><b>{inc.type}:</b> {inc.description}</li>
              ))}
            </ul>
          )}
          <button onClick={() => setIncidentExam(null)} className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500 transition mt-2">Close</button>
        </div>
      )}
    </div>
  );
}

export default ProctoringManagement; 