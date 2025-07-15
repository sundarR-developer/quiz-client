import React from "react";
import { Link } from "react-router-dom";

import "../styles/Main.css";

export default function Main() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-xl bg-white rounded shadow-md p-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">Canadian Trivia Quiz</h1>
        <ol className="list-decimal list-inside text-gray-800 mb-8 space-y-2">
          <li>There are 10 questions</li>
          <li>10 points rewarded for each correct answer</li>
          <li>Each question is multiple choice with only 1 correct answer</li>
          <li>You can review and change answers before the quiz finishes</li>
          <li>Results will be declared upon submission</li>
        </ol>
        <div className="flex justify-center">
          <Link className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition font-semibold" to={"/exams"}>
            Manage Exams
          </Link>
        </div>
      </div>
    </div>
  );
}
