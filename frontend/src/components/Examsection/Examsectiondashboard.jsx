import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import './Examsection';

const ExamDashboard = () => {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' or 'allocation'
  const [branchData, setBranchData] = useState({});
  const [hasAllocationData, setHasAllocationData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

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

    // Check if room allocation data exists
    const allocData = localStorage.getItem('finalRoomAllocation');
    const timestamp = localStorage.getItem('roomAllocationTimestamp');
    
    if (allocData) {
      setHasAllocationData(true);
      
      // Format the timestamp
      if (timestamp) {
        const date = new Date(timestamp);
        setLastUpdated(date.toLocaleString());
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
  
  const handleDownloadRoomAllocation = () => {
    // Download the room allocation data
    const allocData = localStorage.getItem('finalRoomAllocation');
    if (allocData) {
      const blob = new Blob([allocData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'room_allocation.csv';
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

      {/* Simple Room Allocation Tab Content */}
      {activeTab === 'allocation' && (
        <div className="allocation-content" style={{ textAlign: 'center' }}>
          <div className="allocation-box" style={{ 
            background: 'white', 
            padding: '20px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '30px auto'
          }}>
            <h2>Final Room Allocation from Admin</h2>
            {lastUpdated && (
              <p className="last-updated" style={{ fontSize: '0.9rem', color: '#777', fontStyle: 'italic' }}>
                Last updated: {lastUpdated}
              </p>
            )}
            
            {hasAllocationData ? (
              <div>
                <p>Room allocation data is available for download.</p>
                <button 
                  className="download-allocation-btn" 
                  onClick={handleDownloadRoomAllocation}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    margin: '20px auto',
                    padding: '12px 20px',
                    background: 'linear-gradient(to right, #2541b2, #4a6bff)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  <FaDownload /> Download Allocation File
                </button>
              </div>
            ) : (
              <p>No room allocation data available. Please check if admin has uploaded the allocation file.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDashboard;