import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ExamScheduleTable from './ExamScheduleTable';


const ExamDashboard = () => {
  const navigate = useNavigate();
  const examEmployee = JSON.parse(localStorage.getItem('examEmployee'));

  useEffect(() => {
    if (!examEmployee) {
      navigate('/examsectionlogin');
    }
  }, [navigate, examEmployee]);

  return (
    <div className="exam-dashboard-container">
      <div className="exam-dashboard-header">
        <h1>Exam Section Dashboard</h1>
        <p>Enter Number of Invigilators Required for Each Branch</p>
      </div>
      <ExamScheduleTable />
    </div>
  );
};

export default ExamDashboard;