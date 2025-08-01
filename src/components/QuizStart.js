import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserId } from '../redux/result_reducer';
import { getServerData } from '../helper/helper';
import '../styles/Main.css'; // Re-using some styles

const QuizStart = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchExam() {
      const examData = await getServerData(`https://quiz-server-9.onrender.com/api/exams/${examId}`);
      setExam(examData);
    }
    fetchExam();
  }, [examId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputRef.current?.value) {
      dispatch(setUserId(inputRef.current?.value));
      navigate(`/quiz/${examId}`);
    }
  };

  if (!exam) {
    return <div className="flex justify-center items-center min-h-screen"><h3 className="text-gray-900 text-xl font-semibold">Loading exam details...</h3></div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-900">{exam.title}</h1>
        <p className="text-gray-700 text-center mb-6">{exam.description}</p>
        <form id="form" onSubmit={handleSubmit} className="flex flex-col items-center gap-4 pt-4">
          <input
            ref={inputRef}
            className="border rounded px-3 py-2 w-full max-w-xs text-gray-900"
            type="text"
            placeholder="Enter your username to start*"
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold w-full max-w-xs mt-2">Begin Exam</button>
        </form>
      </div>
    </div>
  );
};

export default QuizStart; 