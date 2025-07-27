import React, { useEffect, useState } from "react";
import Questions from "./Questions";
import { useFetchQuestion, MoveNextQuestion, MovePrevQuestion } from '../hooks/FetchQuestion';

/* redux store import */
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useParams } from "react-router-dom";

export default function Quiz() {
  const { examId } = useParams(); // Get examId from URL
  const { queue, trace } = useSelector((state) => state.questions);
  const dispatch = useDispatch();

  /** fetch question hook */
  const [{ isLoading, serverError }] = useFetchQuestion(examId);
  const [examDuration, setExamDuration] = useState(null); // in minutes
  const [timeLeft, setTimeLeft] = useState(null); // in seconds

  useEffect(() => {
    // Save the examId to session storage to access it on the result page
    if (examId) {
      sessionStorage.setItem('currentExamId', examId);
    }
  }, [examId]);

  // Fetch exam duration from the loaded exam data
  useEffect(() => {
    async function fetchExamDuration() {
      try {
        const res = await fetch(`https://quiz-server-8.onrender.com/api/exams/${examId}`);
        const data = await res.json();
        if (data.duration) {
          setExamDuration(data.duration);
          setTimeLeft(data.duration * 60);
        }
      } catch (err) {
        // fallback: no timer
      }
    }
    fetchExamDuration();
  }, [examId]);

  // Timer logic
  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const onPrev = () => {
    if (trace > 0) {
      dispatch(MovePrevQuestion());
    }
  };

  const onNext = () => {
    /* update the trace question value */
    if (trace < queue.length) {
      dispatch(MoveNextQuestion());
      /* reset selected value for next question */
      // setChecked(undefined); // This line was removed as per the edit hint
    }
  };

  const onChecked = (check) => {
    // setChecked(check); // This line was removed as per the edit hint
  };

  /* finished exam after last question */
  if (queue.length > 0 && trace >= queue.length) {
    return <Navigate to={"/result"} replace="true"></Navigate>;
  }

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen"><h3 className="text-gray-900 text-xl font-semibold">Loading Questions...</h3></div>;
  }

  if (serverError) {
    return <div className="flex justify-center items-center min-h-screen"><h3 className="text-red-500 text-xl font-semibold">{serverError?.message || "Unknown Error"}</h3></div>;
  }

  // Auto-submit when time runs out
  if (timeLeft === 0) {
    return <Navigate to={"/result"} replace="true" />;
  }

  // Format timer as MM:SS
  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Canadian Trivia</h1>
        {examDuration && timeLeft !== null && (
          <div className="text-center mb-6">
            <span className="text-lg font-semibold text-blue-700">Time Left: {formatTime(timeLeft)}</span>
          </div>
        )}
        {/* display questions */}
        <Questions onChecked={onChecked} />
        <div className="flex justify-between mt-8">
          {trace > 0 ? (
            <button className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition font-semibold" onClick={onPrev}>
              Prev
            </button>
          ) : (
            <div></div>
          )}
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold" onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
