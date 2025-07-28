import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ExamForm = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exam with retry logic
  const fetchExamData = async () => {
    let retries = 3;
    setLoading(true);
    setError(null);

    while (retries > 0) {
      try {
        const response = await axios.get(
          `https://quiz-server-8.onrender.com/api/exams/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 20000,
          }
        );
        setExam(response.data);
        setQuestions(response.data.questions || []);
        setTimer(response.data.duration * 60); // duration in minutes
        return;
      } catch (err) {
        retries--;
        if (retries === 0) {
          setError("Failed to load exam. Please try again later.");
        } else {
          await new Promise((res) => setTimeout(res, 3000));
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchExamData();
  }, [id]);

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  if (!exam) return null;

  return (
    <div className="exam-container">
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>

      <ol>
        {questions.map((q, index) => (
          <li key={q._id}>
            <p>{q.question}</p>
            <ul>
              {q.options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p>Time Remaining: {timer} seconds</p>
    </div>
  );
};

export default ExamForm;
