import React, { useState } from 'react';
import './Examsectiondashboard.css';

const ExamDashboard = () => {
  const [branchData, setBranchData] = useState({
    CSE: '',
    ECE: '',
    EEE: '',
    CIVIL: '',
    MECH: ''
  });

  const handleInputChange = (branch, value) => {
    if (/^\d*$/.test(value)) {
      setBranchData(prev => ({
        ...prev,
        [branch]: value
      }));
    }
  };

  const handleUpload = () => {
    const totalInvigilators = Object.values(branchData).reduce((a, b) => Number(a) + Number(b), 0);
    const dataToStore = {
      branchData,
      totalInvigilators,
      uploadDate: new Date().toISOString()
    };
    localStorage.setItem('invigilatorData', JSON.stringify(dataToStore));
    alert('Data uploaded successfully!');
  };

  return (
    <div className="exam-dashboard-container">
      <div className="exam-dashboard-header">
        <h1>Exam Section Dashboard</h1>
        <p>Enter Number of Invigilators Required for Each Branch</p>
      </div>

      <div className="branch-inputs">
        {Object.keys(branchData).map(branch => (
          <div key={branch} className="branch-row">
            <label>{branch}:</label>
            <input
              type="text"
              value={branchData[branch]}
              onChange={(e) => handleInputChange(branch, e.target.value)}
              placeholder="Enter number"
            />
          </div>
        ))}
      </div>

      <button className="upload-btn" onClick={handleUpload}>
        Upload Data
      </button>
    </div>
  );
};

export default ExamDashboard