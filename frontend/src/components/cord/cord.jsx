import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload } from 'react-icons/fa';
import './cord.css';

const Cord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { name, department, assignedInvigilators } = location.state || {};

  const handleDownloadExamSchedule = () => {
    const storedSchedule = localStorage.getItem('examSchedule');
    if (!storedSchedule) {
      alert('No exam schedule data available');
      return;
    }
    const scheduleData = JSON.parse(storedSchedule);
    downloadFile(scheduleData.csvContent, 'exam_schedule.csv');
  };

  const handleDownloadAvailableRooms = () => {
    const storedRooms = localStorage.getItem('availableRoomsList');
    if (!storedRooms) {
      alert('No available rooms list found. Please wait for admin to upload the list.');
      return;
    }
    const roomsData = JSON.parse(storedRooms);
    downloadFile(roomsData.content, roomsData.filename || 'available_rooms.csv');
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        alert('Please upload a CSV file');
        return;
      }

      try {
        const text = await file.text();
        localStorage.setItem('finalRoomAllocation', JSON.stringify({
          content: text,
          uploadDate: new Date().toISOString(),
          filename: file.name
        }));
        alert('Final room allocation uploaded successfully!');
      } catch (error) {
        alert('Error uploading file. Please try again.');
        console.error('Upload error:', error);
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
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
            <button className="action-btn" onClick={handleDownloadExamSchedule}>
              Download Required Employees
            </button>
            <button className="action-btn" onClick={() => navigate('/available-employees')}>
              Add Available Employees
            </button>
            <button className="action-btn" onClick={handleDownloadAvailableRooms}>
              Download Available Rooms List
            </button>
            <div className="upload-section">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".csv"
                style={{ display: 'none' }}
              />
              <button className="action-btn" onClick={triggerFileInput}>
                <FaUpload className="mr-2" /> Upload Final Room Allocation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cord;