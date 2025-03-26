import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCheck, FaCalendarAlt, FaDownload, FaEye, FaChartBar } from 'react-icons/fa';
import './cord.css';

const Cord = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [showRoomAllocation, setShowRoomAllocation] = useState(false);
  const [roomAllocationData, setRoomAllocationData] = useState(null);
  const [showEmployeeStats, setShowEmployeeStats] = useState(false);
  const [employeeStats, setEmployeeStats] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  // Calculate and load the employee assignment statistics
  useEffect(() => {
    if (userData && userData.branch) {
      generateEmployeeStats();
    }
  }, [userData, selectedMonth, selectedYear]);

  // Function to generate employee statistics
  const generateEmployeeStats = () => {
    if (!userData || !userData.branch) return;

    try {
      // Get employee data for the department
      const employeeData = localStorage.getItem(`employees_${userData.branch}`);
      if (!employeeData) {
        setEmployeeStats([]);
        return;
      }

      const employees = JSON.parse(employeeData);
      const stats = [];
      const assignmentCounts = {};

      // Count assignments for each employee
      employees.forEach(employee => {
        const empId = employee.id || employee.employeeId;
        if (!empId) return;

        // Initialize counter for this employee if not exists
        if (!assignmentCounts[empId]) {
          assignmentCounts[empId] = {
            id: empId,
            name: employee.name,
            department: employee.department || userData.branch,
            designation: employee.designation || 'Faculty',
            totalAssignments: 0,
            monthlyAssignments: 0
          };
        }

        // Check if employee has been assigned
        if (employee.status === 'assigned') {
          assignmentCounts[empId].totalAssignments++;
          
          // Check if the assignment date is in the selected month
          if (employee.date) {
            const assignmentDate = new Date(employee.date);
            if (
              assignmentDate.getMonth() === selectedMonth && 
              assignmentDate.getFullYear() === selectedYear
            ) {
              assignmentCounts[empId].monthlyAssignments++;
            }
          } else {
            // If no date is specified, assume it's for the current month
            assignmentCounts[empId].monthlyAssignments++;
          }
        }
      });

      // Convert the counts object to an array
      Object.values(assignmentCounts).forEach(employee => {
        stats.push(employee);
      });

      // Sort by number of assignments (highest first)
      stats.sort((a, b) => b.monthlyAssignments - a.monthlyAssignments);
      
      setEmployeeStats(stats);
    } catch (error) {
      console.error('Error generating employee statistics:', error);
      setEmployeeStats([]);
    }
  };

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
      // Hide employee stats if open
      setShowEmployeeStats(false);
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

  // Function to handle showing employee assignment stats
  const handleViewEmployeeStats = () => {
    setShowEmployeeStats(true);
    setShowRoomAllocation(false);
  };

  // Function to handle month change
  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  // Function to handle year change
  const handleYearChange = (e) => {
    setSelectedYear(parseInt(e.target.value));
  };

  // Function to download employee statistics
  const handleDownloadEmployeeStats = () => {
    if (employeeStats.length === 0) {
      alert('No employee statistics available');
      return;
    }

    // Create CSV content
    let csvContent = "Employee ID,Name,Department,Designation,Monthly Assignments,Total Assignments\n";
    
    employeeStats.forEach(emp => {
      csvContent += `${emp.id},${emp.name},${emp.department},${emp.designation},${emp.monthlyAssignments},${emp.totalAssignments}\n`;
    });
    
    // Download the CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee_assignments_${getMonthName(selectedMonth)}_${selectedYear}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // Helper function to get month name
  const getMonthName = (monthIndex) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthIndex];
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
              <p>Download the number of required employees for the examination schedule</p>
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

          <div className="dashboard-card">
            <div className="card-icon stats-icon">
              <FaChartBar />
            </div>
            <div className="card-content">
              <h3>Employee Assignment Stats</h3>
              <p>View monthly invigilation assignment counts for department employees</p>
              <button 
                className="action-button"
                onClick={handleViewEmployeeStats}
              >
                View Statistics
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

        {showEmployeeStats && (
          <div className="employee-stats-container">
            <div className="stats-header">
              <h3>Employee Assignment Statistics</h3>
              <div className="month-selector">
                <div className="selector-group">
                  <label htmlFor="monthSelect">Month:</label>
                  <select 
                    id="monthSelect" 
                    value={selectedMonth} 
                    onChange={handleMonthChange}
                    className="month-select"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{getMonthName(i)}</option>
                    ))}
                  </select>
                </div>
                <div className="selector-group">
                  <label htmlFor="yearSelect">Year:</label>
                  <select 
                    id="yearSelect" 
                    value={selectedYear} 
                    onChange={handleYearChange}
                    className="year-select"
                  >
                    {Array.from({ length: 5 }, (_, i) => (
                      <option key={i} value={new Date().getFullYear() - 2 + i}>
                        {new Date().getFullYear() - 2 + i}
                      </option>
                    ))}
                  </select>
                </div>
                <button 
                  className="download-button"
                  onClick={handleDownloadEmployeeStats}
                  title="Download Statistics"
                >
                  <FaDownload /> Export
                </button>
              </div>
            </div>
            
            <div className="stats-info">
              <p>Showing statistics for <strong>{getMonthName(selectedMonth)} {selectedYear}</strong></p>
              <p>Total Employees: <strong>{employeeStats.length}</strong></p>
              <p>Assigned Employees: <strong>{employeeStats.filter(emp => emp.monthlyAssignments > 0).length}</strong></p>
            </div>
            
            <div className="table-wrapper">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Designation</th>
                    <th>Monthly Assignments</th>
                    <th>Total Assignments</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeStats.length > 0 ? (
                    employeeStats.map((employee, index) => (
                      <tr key={index} className={employee.monthlyAssignments > 0 ? 'has-assignments' : ''}>
                        <td>{employee.id}</td>
                        <td>{employee.name}</td>
                        <td>{employee.designation}</td>
                        <td className="count-cell">
                          <span className={`count-badge ${getCountClass(employee.monthlyAssignments)}`}>
                            {employee.monthlyAssignments}
                          </span>
                        </td>
                        <td>{employee.totalAssignments}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="no-data">No employee data available for this month</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <button 
              className="close-button"
              onClick={() => setShowEmployeeStats(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to determine count class for styling
const getCountClass = (count) => {
  if (count === 0) return 'zero';
  if (count === 1) return 'low';
  if (count === 2) return 'medium';
  if (count >= 3) return 'high';
  return '';
};

export default Cord;