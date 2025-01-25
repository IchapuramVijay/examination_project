import React from 'react';
import { useLocation } from 'react-router-dom';
import './cord.css';
import * as XLSX from 'xlsx';

const Cord = () => {
  const location = useLocation();
  const { name, department, assignedInvigilators } = location.state || {}; // Get the passed name, department, and invigilators

  const handleDownloadInvigilators = () => {
    const storedData = JSON.parse(localStorage.getItem('invigilatorData'));
    if (!storedData) {
      alert('No invigilator data available');
      return;
    }

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet([
      { ...storedData.branchData, 
        'Total Invigilators': storedData.totalInvigilators,
        'Upload Date': new Date(storedData.uploadDate).toLocaleString() 
      }
    ]);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Invigilators');
    XLSX.writeFile(workbook, 'invigilator_requirements.xlsx');
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
              <button className="action-btn">Download Invigilator File</button>
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
