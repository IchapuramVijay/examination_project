import React, { useState } from 'react';
import './Examsection.css';
import { useNavigate } from 'react-router-dom';
import { examEmployeeLogin } from '../../auth/Examsectionauth';
import collegelogo from '../../assets/collegelogo.jpg';

const ExamSectionEmployee = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = examEmployeeLogin(employeeId, password);
    if (result.status === "success") {
      localStorage.setItem('examEmployee', JSON.stringify(result.data));
      navigate('/examsectiondashboard');
    } else {
      alert(result.message);
    }
  }

  return (
    <form className="exam-login-form" onSubmit={handleSubmit}>
      <img src={collegelogo} alt="College Logo" className="exam-college-logo" />
      <div className="exam-form-content">
        <div className="exam-form-group">
          <label>Examsection :</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
          />
        </div>
        <div className="exam-form-group">
          <label>Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="exam-submit-btn">Submit</button>
      </div>
    </form>
  );
};

export default ExamSectionEmployee;