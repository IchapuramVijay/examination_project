import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDownload, FaUpload } from 'react-icons/fa';
import './Admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleDownloadExamSchedule = () => {
    const storedSchedule = localStorage.getItem('examSchedule');
    if (!storedSchedule) {
      alert('No exam schedule data available');
      return;
    }
    const scheduleData = JSON.parse(storedSchedule);
    downloadFile(scheduleData.csvContent, 'exam_schedule.csv');
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
        localStorage.setItem('availableRoomsList', JSON.stringify({
          content: text,
          uploadDate: new Date().toISOString(),
          filename: file.name
        }));
        alert('Available rooms list uploaded successfully!');
      } catch (error) {
        alert('Error uploading file. Please try again.');
        console.error('Upload error:', error);
      }
    }
  };

  const handleDownloadFinalAllocation = () => {
    const storedAllocation = localStorage.getItem('finalRoomAllocation');
    if (!storedAllocation) {
      alert('No final room allocation data available. Please wait for coordinator to upload.');
      return;
    }
    const allocationData = JSON.parse(storedAllocation);
    downloadFile(allocationData.content, 'final_room_allocation.csv');
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
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-info">
          <span><strong>Employee Name:</strong> {admin?.name}</span>
          <span><strong>Department:</strong> {admin?.department}</span>
        </div>
      </div>

      <div className="exam-info">
        <h2>3rd Year Regular and Supply Examination 2024-25</h2>
        <h3>Room and Staff Allocation Portal</h3>
      </div>
      
      <div className="admin-actions">
        <div className="action-card">
          <h3>Exam Section Schedule</h3>
          <div className="action-buttons">
            <FaDownload 
              className="download-icon" 
              title="Download Exam Schedule" 
              onClick={handleDownloadExamSchedule}
            />
          </div>
        </div>

        <div className="action-card">
          <h3>Available Rooms</h3>
          <div className="action-buttons">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              style={{ display: 'none' }}
            />
            <FaUpload 
              className="upload-icon"
              title="Upload Available Rooms List"
              onClick={triggerFileInput}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        <div className="action-card">
          <h3>Final Room Allocation</h3>
          <button 
            className="admin-download-btn" 
            onClick={handleDownloadFinalAllocation}
          >
            <FaDownload /> Download Final Allocation
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;