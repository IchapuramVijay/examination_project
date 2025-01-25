import React from 'react';
import { useLocation } from 'react-router-dom';
import './cord.css';

const Cord = () => {
  const location = useLocation();
  const { name, department, assignedInvigilators } = location.state || {};

  const handleDownloadInvigilators = () => {
    const storedData = JSON.parse(localStorage.getItem('invigilatorData'));
    if (!storedData) {
      alert('No invigilator data available');
      return;
    }

    // Convert data to CSV format
    const headers = Object.keys(storedData.branchData).join(',') + ',Total Invigilators,Upload Date\n';
    const values = Object.values(storedData.branchData).join(',') + 
      ',' + storedData.totalInvigilators + 
      ',' + new Date(storedData.uploadDate).toLocaleString() + '\n';
    
    const csvContent = headers + values;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'invigilator_requirements.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {name}</h1>
        <p className="subheading">Coordinator Dashboard</p>
      </div>

      <div className="dashboard-content">
        <div className="employee-info">
          <h2>Employee Details</h2>
          <div className="info-item">
            <strong>Name:</strong> {name}
          </div>
          <div className="info-item">
            <strong>Department:</strong> {department}
          </div>
          <div className="info-item">
            <strong>Assigned Invigilators:</strong> {assignedInvigilators}
          </div>
        </div>

        <div className="actions">
          <h2>Actions</h2>
          <div className="action-buttons">
            <div className="invigilators-download">
              <button className="action-btn" onClick={handleDownloadInvigilators}>
                Download Invigilator File
              </button>
              <p className="assigned-count">{assignedInvigilators} Invigilators</p>
            </div>
            <button className="action-btn">Download Rooms & Students</button>
            <button className="action-btn">Upload Invigilator Allocated File</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cord;