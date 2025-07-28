import React, { useEffect, useState, useCallback } from "react";
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

  // ✅ Fix: Wrap fetchExamData in useCallback
  const fetchExamData = useCallback(async () => {
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
        const data = response.data;
        setExam(data);
        setQuestions(data.questions || []);
        setTimer(data.duration * 60); // Convert minutes to seconds
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
  }, [id, token]); // ✅ Include dependencies here

  // Countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timer === 0 && exam) {
      console.log("⏰ Time's up!");
      // Optional: trigger submission
    }

    return () => clearInterval(interval);
  }, [timer, exam]);

  // ✅ No ESLint warning now
  useEffect(() => {
    fetchExamData();
  }, [fetchExamData]);

  if (loading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (error) return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  if (!exam) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="exam-container">
      <h2>{exam.title}</h2>
      <p>{exam.description}</p>

      <p><strong>Time Remaining:</strong> {formatTime(timer)}</p>

      <ol>
        {questions.map((q) => (
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
    </div>
  );
};

export default ExamForm;
