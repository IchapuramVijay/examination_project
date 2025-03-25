import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCheck, FaCalendarAlt, FaDownload, FaEye } from 'react-icons/fa';
import './cord.css';

const Cord = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showRoomAllocation, setShowRoomAllocation] = useState(false);
  const [roomAllocationData, setRoomAllocationData] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const coordinatorData = localStorage.getItem('coordinatorData');
      if (!coordinatorData) {
        return false;
      }
      const data = JSON.parse(coordinatorData);
      return data.isAuthenticated && data.branch;
    };

    if (!checkAuth()) {
      navigate('/coordinator', { replace: true });
      return;
    }

    const data = JSON.parse(localStorage.getItem('coordinatorData'));
    setUserData(data);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('coordinatorData');
    navigate('/coordinator', { replace: true });
  };

  // Function to navigate to the available employees page
  const handleManageEmployees = () => {
    navigate('/available-employees');
  };

  // Updated function to preserve the exact format of exam schedule data
  const handleExamScheduleDownload = () => {
    try {
      // Get the exam schedule from localStorage
      const examScheduleData = localStorage.getItem('examSchedule');
      if (!examScheduleData) {
        alert('No exam schedule available at this time');
        return;
      }
      
      let csvContent = "";
      
      try {
        // First try to parse the data as JSON
        const parsedData = JSON.parse(examScheduleData);
        
        // If the data contains csvContent field, use it directly
        if (parsedData.csvContent) {
          csvContent = parsedData.csvContent;
        } else if (parsedData.originalContent) {
          // If there's an originalContent field, use that
          csvContent = parsedData.originalContent;
        } else {
          // If it's a structured JSON object, convert it to CSV without reformatting
          csvContent = 'Branch,';
          
          // Get column headers (day periods)
          const firstBranch = Object.keys(parsedData)[0];
          if (firstBranch && parsedData[firstBranch]) {
            const dayPeriods = Object.keys(parsedData[firstBranch]);
            // Sort to ensure consistent order
            dayPeriods.sort();
            
            // Add original column headers without reformatting
            dayPeriods.forEach(dp => {
              csvContent += dp + ',';
            });
            
            csvContent = csvContent.slice(0, -1) + '\n';
            
            // Add data rows
            Object.keys(parsedData).forEach(branch => {
              csvContent += branch + ',';
              dayPeriods.forEach(dp => {
                csvContent += (parsedData[branch][dp] || '0') + ',';
              });
              csvContent = csvContent.slice(0, -1) + '\n';
            });
          }
        }
      } catch (parseError) {
        // If parsing as JSON fails, it might already be a CSV string
        // Use it directly without any modifications
        csvContent = examScheduleData;
      }
      
      if (!csvContent) {
        alert('Could not process the exam schedule data');
        return;
      }
      
      // Download the CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'exam_schedule.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading exam schedule:', error);
      alert('Error processing exam schedule data');
    }
  };

  // Function to handle showing the final room allocation
  const handleViewRoomAllocation = () => {
    try {
      // Get the room allocation data from localStorage (stored by admin)
      const roomAllocation = localStorage.getItem('finalRoomAllocation');
      if (!roomAllocation) {
        alert('No room allocation data available yet. Please check back later.');
        return;
      }
      
      // Parse the CSV content
      const rows = roomAllocation.split('\n');
      const headers = rows[0].split(',');
      
      // Parse data rows
      const data = [];
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].trim() === '') continue;
        
        const values = rows[i].split(',');
        const rowData = {};
        
        headers.forEach((header, index) => {
          rowData[header.trim()] = values[index] ? values[index].trim() : '';
        });
        
        data.push(rowData);
      }
      
      // Set the data to state to display it
      setRoomAllocationData({ headers, data });
      // Show the allocation section
      setShowRoomAllocation(true);
    } catch (error) {
      console.error('Error processing room allocation data:', error);
      alert('Error loading room allocation data. Please try again later.');
    }
  };

  // Function to download the room allocation data
  const handleDownloadRoomAllocation = () => {
    try {
      const roomAllocation = localStorage.getItem('finalRoomAllocation');
      if (!roomAllocation) {
        alert('No room allocation data available');
        return;
      }
      
      // Download the CSV
      const blob = new Blob([roomAllocation], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'room_allocation.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading room allocation:', error);
      alert('Error processing room allocation data');
    }
  };

  // Branch label mapping for display
  const getBranchLabel = (branchCode) => {
    const branchLabels = {
      'CSE': 'Computer Science Engineering',
      'CSBS': 'Computer Science and Business Systems',
      'CSE(DS)': 'Computer Science (Data Science)',
      'CSE(AI&ML)': 'Computer Science (AI & Machine Learning)',
      'CSE(IOT)': 'Computer Science (Internet of Things)',
      'IT': 'Information Technology',
      'ECE': 'Electronics and Communication Engineering',
      'EEE': 'Electrical and Electronics Engineering',
      'CIVIL': 'Civil Engineering',
      'MECH': 'Mechanical Engineering',
      'Chemical': 'Chemical Engineering',
      'MCA': 'Master of Computer Applications',
      'MBA': 'Master of Business Administration'
    };
    
    return branchLabels[branchCode] || branchCode;
  };

  if (!userData) return null;

  return (
    <div className="coordinator-panel">
      <div className="main-header">
        <h1>Coordinator Panel - {getBranchLabel(userData.branch)}</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="content-section">
        <div className="dashboard-cards">
          <div className="dashboard-card">
            <div className="card-icon employee-icon">
              <FaUserCheck />
            </div>
            <div className="card-content">
              <h3>Manage Staff Availability</h3>
              <p>Add and manage faculty members available for invigilation</p>
              <button 
                className="action-button primary-action"
                onClick={handleManageEmployees}
              >
                Manage Employees
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon schedule-icon">
              <FaCalendarAlt />
            </div>
            <div className="card-content">
              <h3>Required Employees Schedule</h3>
              <p>Download the  number of required employees for the examination schedule</p>
              <button 
                className="action-button"
                onClick={handleExamScheduleDownload}
              >
                <FaDownload /> Download Required List
              </button>
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-icon allocation-icon">
              <FaEye />
            </div>
            <div className="card-content">
              <h3>Room Allocation</h3>
              <p>View and download the final room allocation details</p>
              <button 
                className="action-button"
                onClick={handleViewRoomAllocation}
              >
                View Allocation
              </button>
            </div>
          </div>
        </div>

        {showRoomAllocation && roomAllocationData && (
          <div className="room-allocation-container">
            <div className="allocation-header">
              <h3>Room Allocation Details</h3>
              <button 
                className="download-button"
                onClick={handleDownloadRoomAllocation}
                title="Download Room Allocation"
              >
                Download
              </button>
            </div>
            
            <div className="table-wrapper">
              <table className="allocation-table">
                <thead>
                  <tr>
                    {roomAllocationData.headers.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {roomAllocationData.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {roomAllocationData.headers.map((header, colIndex) => (
                        <td key={colIndex}>{row[header]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <button 
              className="close-button"
              onClick={() => setShowRoomAllocation(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cord;