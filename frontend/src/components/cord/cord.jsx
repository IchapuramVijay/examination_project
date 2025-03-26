import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserCheck, FaCalendarAlt, FaDownload, FaEye, FaChartBar, FaTimes } from 'react-icons/fa';
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
  
  // New state for showing exam section data
  const [showExamSectionData, setShowExamSectionData] = useState(false);
  const [examSectionData, setExamSectionData] = useState(null);
  const [examSectionDataTimestamp, setExamSectionDataTimestamp] = useState(null);

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

  // Function to handle viewing exam section data - UPDATED TO FILTER BY BRANCH
  const handleViewExamSectionData = () => {
    try {
      // Get the invigilator data uploaded by the exam section
      const invigilatorData = localStorage.getItem('invigilatorData');
      if (!invigilatorData) {
        alert('No data uploaded by the exam section is available yet.');
        return;
      }
      
      const parsedData = JSON.parse(invigilatorData);
      
      // Get coordinator's branch
      const coordinatorBranch = userData.branch;
      if (!coordinatorBranch) {
        alert('Error: Unable to determine your department.');
        return;
      }
      
      // Filter branchData to only include the coordinator's branch
      const filteredBranchData = {};
      if (parsedData.branchData && parsedData.branchData[coordinatorBranch] !== undefined) {
        filteredBranchData[coordinatorBranch] = parsedData.branchData[coordinatorBranch];
      } else {
        alert('No invigilator data available for your department.');
        return;
      }
      
      // Format the data for display, but only include the coordinator's branch
      const formattedData = {
        examDates: parsedData.examDates || [],
        branchData: filteredBranchData,
        totalInvigilators: filteredBranchData[coordinatorBranch] || 0,
        uploadDate: parsedData.uploadDate ? new Date(parsedData.uploadDate) : null
      };
      
      setExamSectionData(formattedData);
      setExamSectionDataTimestamp(formattedData.uploadDate);
      
      // Close other panels and show exam section data
      setShowExamSectionData(true);
      setShowRoomAllocation(false);
      setShowEmployeeStats(false);
    } catch (error) {
      console.error('Error loading exam section data:', error);
      alert('Error loading data from exam section. Please try again later.');
    }
  };

  // Function to download exam section data - UPDATED TO FILTER BY BRANCH
  const handleDownloadExamSectionData = () => {
    try {
      // Get the invigilator data uploaded by exam section
      const invigilatorData = localStorage.getItem('invigilatorData');
      if (!invigilatorData) {
        alert('No data to download');
        return;
      }
      
      const parsedData = JSON.parse(invigilatorData);
      const coordinatorBranch = userData.branch;
      
      // Create CSV content for download - ONLY FOR THIS BRANCH
      let csvContent = 'Branch,Total Invigilators Required\n';
      
      // Add only this branch's data
      if (parsedData.branchData && parsedData.branchData[coordinatorBranch] !== undefined) {
        csvContent += `${coordinatorBranch},${parsedData.branchData[coordinatorBranch]}\n`;
      } else {
        alert('No data available for your department.');
        return;
      }
      
      // Add timestamp
      if (parsedData.uploadDate) {
        csvContent += `\nLast Updated,${new Date(parsedData.uploadDate).toLocaleString()}\n`;
      }
      
      // Add detailed schedule if available - ONLY FOR THIS BRANCH
      if (parsedData.examDates && parsedData.examDates.length > 0) {
        csvContent += '\n\nDetailed Schedule:\n';
        
        // Add header row with all dates
        csvContent += 'Date,AM Session,PM Session\n';
        
        // Add data for each date
        parsedData.examDates.forEach(dateObj => {
          if (dateObj.date) {
            const amValue = dateObj.amValues && dateObj.amValues[coordinatorBranch] 
              ? dateObj.amValues[coordinatorBranch] 
              : '0';
              
            const pmValue = dateObj.pmValues && dateObj.pmValues[coordinatorBranch]
              ? dateObj.pmValues[coordinatorBranch]
              : '0';
              
            csvContent += `${dateObj.date},${amValue},${pmValue}\n`;
          }
        });
      }
      
      // Download the CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${coordinatorBranch}_invigilator_requirements.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading exam section data:', error);
      alert('Error processing data for download');
    }
  };

  // Function to handle showing employee assignment stats
  const handleViewEmployeeStats = () => {
    setShowEmployeeStats(true);
    setShowRoomAllocation(false);
    setShowExamSectionData(false);
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
    link.download = `${userData.branch}_employee_assignments_${getMonthName(selectedMonth)}_${selectedYear}.csv`;
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
              <h3>Exam Section Data</h3>
              <p>View and download the invigilator requirements for your department</p>
              <button 
                className="action-button"
                onClick={handleViewExamSectionData}
              >
                <FaEye /> View Requirements
              </button>
            </div>
          </div>

          {/* Room Allocation card removed */}

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

        {/* Exam Section Data Display - UPDATED TO SHOW ONLY COORDINATOR'S BRANCH */}
        {showExamSectionData && examSectionData && (
          <div className="exam-section-data-container">
            <div className="section-header">
              <h3>{getBranchLabel(userData.branch)} - Invigilator Requirements</h3>
              <div className="section-actions">
                <button 
                  className="download-button"
                  onClick={handleDownloadExamSectionData}
                  title="Download Requirements"
                >
                  <FaDownload /> Download
                </button>
                <button 
                  className="close-panel-button"
                  onClick={() => setShowExamSectionData(false)}
                  title="Close"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
            
            {examSectionDataTimestamp && (
              <div className="timestamp-info">
                <p>Last Updated: {examSectionDataTimestamp.toLocaleString()}</p>
                <p>Total Invigilators Required: <strong>{examSectionData.totalInvigilators}</strong></p>
              </div>
            )}

            <div className="section-content">
              <h4>Department Overview</h4>
              <div className="department-summary">
                <div className="summary-card">
                  <div className="summary-title">Department</div>
                  <div className="summary-value">{userData.branch}</div>
                </div>
                <div className="summary-card">
                  <div className="summary-title">Total Invigilators Required</div>
                  <div className="summary-value highlight">{examSectionData.totalInvigilators}</div>
                </div>
              </div>

              {examSectionData.examDates && examSectionData.examDates.length > 0 && (
                <>
                  <h4>Detailed Schedule</h4>
                  <div className="table-wrapper">
                    <table className="schedule-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>AM Session</th>
                          <th>PM Session</th>
                          <th>Daily Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {examSectionData.examDates.map((dateObj, index) => {
                          if (!dateObj.date) return null;
                          
                          const amValue = dateObj.amValues && dateObj.amValues[userData.branch] 
                            ? parseInt(dateObj.amValues[userData.branch]) 
                            : 0;
                            
                          const pmValue = dateObj.pmValues && dateObj.pmValues[userData.branch]
                            ? parseInt(dateObj.pmValues[userData.branch])
                            : 0;
                            
                          const dailyTotal = amValue + pmValue;
                          
                          // Only show dates with non-zero requirements
                          if (dailyTotal === 0) return null;
                          
                          return (
                            <tr key={index}>
                              <td>{formatDate(dateObj.date)}</td>
                              <td className={amValue > 0 ? "count-cell highlight-value" : "count-cell"}>
                                {amValue}
                              </td>
                              <td className={pmValue > 0 ? "count-cell highlight-value" : "count-cell"}>
                                {pmValue}
                              </td>
                              <td className="count-cell total-value">{dailyTotal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            
            <div className="actions-footer">
              <button 
                className="close-button"
                onClick={() => setShowExamSectionData(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Room Allocation panel code kept for future use but not shown */}

        {showEmployeeStats && (
          <div className="employee-stats-container">
            <div className="stats-header">
              <h3>Employee Assignment Statistics</h3>
              <div className="right-controls">
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
                </div>
                <div className="section-actions">
                  <button 
                    className="download-button"
                    onClick={handleDownloadEmployeeStats}
                    title="Download Statistics"
                  >
                    <FaDownload /> Export
                  </button>
                  <button 
                    className="close-panel-button"
                    onClick={() => setShowEmployeeStats(false)}
                    title="Close"
                  >
                    <FaTimes />
                  </button>
                </div>
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
            
            <div className="actions-footer">
              <button 
                className="close-button"
                onClick={() => setShowEmployeeStats(false)}
              >
                Close
              </button>
            </div>
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