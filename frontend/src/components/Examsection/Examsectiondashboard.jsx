import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import './Examsection';

const ExamDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'allocation'
  const [branchData, setBranchData] = useState({});
  const [roomAllocation, setRoomAllocation] = useState(null);
  const [allocationTimestamp, setAllocationTimestamp] = useState(null);

  // Set up the days and periods
  const days = [1, 2, 3, 4, 5, 6];
  const periods = ['AM', 'PM'];
  const branches = ['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH'];

  // Initialize branch data for all days and periods
  useEffect(() => {
    // Initialize branch data with zeros for all days and periods
    const initialData = {};
    branches.forEach(branch => {
      initialData[branch] = {};
      days.forEach(day => {
        periods.forEach(period => {
          initialData[branch][`Day${day}${period}`] = 0;
        });
      });
    });

    // Load any existing schedule data from localStorage
    const storedSchedule = localStorage.getItem('examSchedule');
    if (storedSchedule) {
      try {
        const parsedData = JSON.parse(storedSchedule);
        setBranchData(parsedData);
      } catch (error) {
        console.error('Error parsing stored schedule:', error);
        setBranchData(initialData);
      }
    } else {
      setBranchData(initialData);
    }

    // Check for room allocation data from admin
    const allocData = localStorage.getItem('finalRoomAllocation');
    const timestamp = localStorage.getItem('roomAllocationTimestamp');
    
    if (allocData) {
      try {
        // Parse the CSV data
        const lines = allocData.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Find indices for needed columns
        const roomIndex = headers.findIndex(h => h.includes('Room'));
        const blockIndex = headers.findIndex(h => h.includes('Block'));
        const seniorProfIndex = headers.findIndex(h => h.includes('Senior Professor'));
        const juniorProfIndex = headers.findIndex(h => h.includes('Junior Professor'));
        
        // Check if all needed columns exist
        if (roomIndex >= 0 && blockIndex >= 0 && seniorProfIndex >= 0 && juniorProfIndex >= 0) {
          // Process the data
          const parsedData = [];
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines
            
            const values = lines[i].split(',').map(val => val.trim());
            parsedData.push({
              room: values[roomIndex],
              block: values[blockIndex],
              seniorProfessor: values[seniorProfIndex],
              juniorProfessor: values[juniorProfIndex]
            });
          }
          
          setRoomAllocation(parsedData);
          
          // Format the timestamp
          if (timestamp) {
            const date = new Date(timestamp);
            setAllocationTimestamp(date.toLocaleString());
          }
        }
      } catch (error) {
        console.error('Error parsing room allocation data:', error);
      }
    }
  }, []);

  const handleInputChange = (branch, dayPeriod, value) => {
    if (/^\d*$/.test(value)) { // Only allow numeric values
      setBranchData(prev => ({
        ...prev,
        [branch]: {
          ...prev[branch],
          [dayPeriod]: value === '' ? 0 : parseInt(value, 10)
        }
      }));
    }
  };

  const handleSubmitSchedule = () => {
    localStorage.setItem('examSchedule', JSON.stringify(branchData));
    alert('Schedule saved successfully!');
  };
  
  const handleDownloadAllocation = () => {
    // Download the room allocation data
    if (roomAllocation) {
      const headers = 'Room,Block,Senior Professor,Junior Professor\n';
      const csvRows = roomAllocation.map(item => 
        `${item.room},${item.block},${item.seniorProfessor},${item.juniorProfessor}`
      );
      
      const csvContent = headers + csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'final_room_allocation.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      alert('No room allocation data available. Please check if admin has uploaded the allocation file.');
    }
  };

  return (
    <div className="exam-dashboard-container">
      <div className="exam-dashboard-header">
        <h1>Exam Section Dashboard</h1>
      </div>

      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button 
          className={`tab-button ${activeTab === 'allocation' ? 'active' : ''}`}
          onClick={() => setActiveTab('allocation')}
        >
          <FaDownload /> Final Room Allocation
        </button>
      </div>

      {/* Schedule Tab Content */}
      {activeTab === 'schedule' && (
        <div className="schedule-content">
          <p className="tab-description">Enter Number of Invigilators Required for Each Branch</p>
          
          <div className="schedule-table-container">
            <table className="schedule-table">
              <thead>
                <tr>
                  <th>Branch</th>
                  {days.map(day => (
                    periods.map(period => (
                      <th key={`Day${day}${period}`}>Day {day} {period}</th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {branches.map(branch => (
                  <tr key={branch}>
                    <td className="branch-name">{branch}</td>
                    {days.map(day => (
                      periods.map(period => {
                        const dayPeriodKey = `Day${day}${period}`;
                        return (
                          <td key={dayPeriodKey}>
                            <input
                              type="text"
                              value={branchData[branch]?.[dayPeriodKey] || 0}
                              onChange={(e) => handleInputChange(branch, dayPeriodKey, e.target.value)}
                              className="schedule-input"
                            />
                          </td>
                        );
                      })
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="submit-btn" onClick={handleSubmitSchedule}>
            Submit Schedule
          </button>
        </div>
      )}

      {/* Room Allocation Tab Content */}
      {activeTab === 'allocation' && (
        <div className="allocation-content">
          {roomAllocation ? (
            <>
              <div className="allocation-header">
                <h2>Final Room Allocation</h2>
                {allocationTimestamp && (
                  <p className="last-updated">Last updated: {allocationTimestamp}</p>
                )}
                <button 
                  className="download-allocation-btn" 
                  onClick={handleDownloadAllocation}
                >
                  <FaDownload /> Download Allocation File
                </button>
              </div>
              
              <div className="allocation-stats">
                <div className="stat-item">
                  <span className="stat-value">{roomAllocation.length}</span>
                  <span className="stat-label">Total Rooms</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{roomAllocation.filter(r => r.seniorProfessor).length}</span>
                  <span className="stat-label">Senior Professors</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">{roomAllocation.filter(r => r.juniorProfessor).length}</span>
                  <span className="stat-label">Junior Professors</span>
                </div>
              </div>
              
              <div className="allocation-table-container">
                <table className="allocation-table">
                  <thead>
                    <tr>
                      <th>Room</th>
                      <th>Block</th>
                      <th>Senior Professor</th>
                      <th>Junior Professor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomAllocation.map((item, index) => (
                      <tr key={index}>
                        <td>{item.room}</td>
                        <td>{item.block}</td>
                        <td>{item.seniorProfessor}</td>
                        <td>{item.juniorProfessor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="no-allocation-message">
              <p>No room allocation data available.</p>
              <p>Please check if admin has uploaded the final room allocation file.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamDashboard;