import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload, FaChevronDown } from 'react-icons/fa';
import './Admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [selectedBranch, setSelectedBranch] = useState('Select Branch');

  if (!admin) {
    navigate('/admin');
    return null;
  }

  // Function to handle the upload of final room allocation with no constraints
  const handleUploadAllocation = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
          const content = e.target.result;
          
          // Store the file content without any validation
          localStorage.setItem('finalRoomAllocation', content);
          
          // Store upload timestamp
          localStorage.setItem('roomAllocationTimestamp', new Date().toISOString());
          
          alert('Room allocation uploaded successfully!');
        };
        
        reader.onerror = () => {
          alert('Error reading file');
        };
        
        reader.readAsText(file);
      }
    };
    
    input.click();
  };

  // Function to handle download from Required Employees From Exam Section
  const handleDownloadExamEmployees = () => {
    const allocData = localStorage.getItem('finalRoomAllocation');
    if (!allocData) {
      alert('No room allocation data available');
      return;
    }

    const blob = new Blob([allocData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'room_allocation.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="admin-details">
        <span>Emp Name: {admin?.name}</span>
        <span>Dept: {admin?.department}</span>
      </div>
      
      {/* Exam Info Banner */}
      <div className="exam-info">
        <h2>Regular and supply examination 24-25</h2>
        <h3>Room and Staff Allocation</h3>
      </div>
      
      {/* Available Rooms Button */}
      <div className="rooms-dropdown-container">
        <button className="rooms-dropdown-btn">
          Available Rooms <FaChevronDown />
        </button>
      </div>
      
      {/* Main Content Grid */}
      <div className="main-actions-row">
        {/* Left Card - Available Employees */}
        <div className="action-card employees-card">
          <h3>Available Employees by Department</h3>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div className="dropdown-container">
              <select 
                value={selectedBranch} 
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="dropdown-button"
              >
                <option value="Select Branch">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="CIVIL">CIVIL</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Right Card - Final Room Allocation */}
        <div className="action-card allocation-card">
          <h3>Final Room Allocation</h3>
          
          <p className="allocation-description">
            Upload CSV with room assignments (senior & junior professors)
          </p>
          
          <div className="upload-container">
            <button 
              onClick={handleUploadAllocation}
              className="upload-allocation-btn"
            >
              <FaUpload className="upload-icon" /> Upload Allocation File
            </button>
          </div>
          
          <div className="allocation-note">
            <p>Note: Each room requires one senior professor and one junior professor from the available employees list.</p>
          </div>
        </div>
      </div>
      
      {/* Single Bottom Card */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <div className="action-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3>Required Employees From Exam Section</h3>
          <div className="action-buttons">
            <div onClick={handleDownloadExamEmployees} style={{ cursor: 'pointer' }}>
              <FaDownload className="download-icon" title="Download" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;