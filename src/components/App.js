import "../styles/App.css";
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import Login from './Login';
import Register from './Register';
import Quiz from "./Quiz";
import Result from "./Result";
import { CheckUserExist } from "../helper/helper";
import ExamList from './ExamList';
import ExamForm from './ExamForm';
import ProctoringWrapper from './ProctoringWrapper';
import AnalysisDashboard from './AnalysisDashboard';
import QuizStart from './QuizStart';
import Home from './Home';
import ExamDetails from './ExamDetails';
import StudentResults from './StudentResults';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/quiz/start/:examId" element={
        <ProctoringWrapper>
          <QuizStart />
        </ProctoringWrapper>
      } />
      <Route path="/quiz/:examId" element={
        <CheckUserExist>
          <ProctoringWrapper>
            <Quiz />
          </ProctoringWrapper>
        </CheckUserExist>
      } />
      <Route path="/result" element={<Result />} />
      <Route path="/exams" element={<ExamList />} />
      <Route path="/exams/new" element={<ExamForm />} />
      <Route path="/exams/edit/:examId" element={<ExamForm />} />
      <Route path="/exams/:id/analysis" element={<AnalysisDashboard />} />
      <Route path="/admin" element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </PrivateRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/student" element={
        <PrivateRoute allowedRoles={['student', 'admin']}>
          <StudentDashboard />
        </PrivateRoute>
      } />
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/exam/:id" element={<ExamDetails />} />
      <Route path="/exam/:id/take" element={
        <ProctoringWrapper>
          <ExamForm />
        </ProctoringWrapper>
      } />
      <Route path="/student-results" element={<StudentResults />} />
    </Routes>
  );
}

export default App;
