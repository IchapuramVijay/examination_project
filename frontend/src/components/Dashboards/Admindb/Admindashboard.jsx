import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload, FaFileUpload, FaFilter, FaCalendarAlt, 
  FaCheck, FaTimes, FaCircle, FaClock, FaEdit, FaCheckDouble } from 'react-icons/fa';
import './Admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const initialDataLoaded = useRef(false);
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [activeTab, setActiveTab] = useState('pending');
  const [filterDate, setFilterDate] = useState('');
  const [filterSession, setFilterSession] = useState('');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [markedEmployees, setMarkedEmployees] = useState({});
  const [currentStage, setCurrentStage] = useState('selection'); // 'selection', 'review'
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // Cache our data to avoid recalculating it repeatedly
  const [pendingCount, setPendingCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  
  // All branches
  const branches = [
    'CSE', 'CSBS', 'CSE(DS)', 'CSE(AI&ML)', 'CSE(IOT)', 'IT', 
    'ECE', 'EEE', 'CIVIL', 'MECH', 'Chemical', 'MCA', 'MBA'
  ];

  // State to store all employees data by branch
  const [allBranchesData, setAllBranchesData] = useState({});
  
  // Filtered employees data
  const [filteredEmployeesData, setFilteredEmployeesData] = useState({});

  // Branch visibility - pre-calculate which branches to show
  const [branchesToShow, setBranchesToShow] = useState({
    pending: [],
    assigned: [],
    rejected: []
  });

  // Check if admin is logged in
  useEffect(() => {
    if (!admin) {
      navigate('/admin');
    }
  }, [navigate, admin]);

  // Load data ONCE on initial render
  useEffect(() => {
    if (initialDataLoaded.current) return;

    const branchesData = {};
    
    branches.forEach(branch => {
      try {
        const employeeData = localStorage.getItem(`employees_${branch}`);
        if (employeeData) {
          const parsedData = JSON.parse(employeeData);
          
          // Add status field if not present and ensure session field exists
          const dataWithStatusAndSession = parsedData.map(emp => ({
            ...emp,
            status: emp.status || null, // null = not decided, 'assigned' or 'rejected'
            session: emp.session || 'AM', // Default to AM if session not specified
            branch: branch // Add branch for reference
          }));
          
          branchesData[branch] = dataWithStatusAndSession;
        } else {
          branchesData[branch] = [];
        }
      } catch (error) {
        console.error(`Error parsing data for branch ${branch}:`, error);
        branchesData[branch] = [];
      }
    });
    
    // Set the data only once
    setAllBranchesData(branchesData);
    setFilteredEmployeesData(branchesData);
    initialDataLoaded.current = true;
  }, []); // Empty dependency array - run only once

  // Update branch visibility and counts whenever filtered data changes
  useEffect(() => {
    // Only calculate branch visibility and counts when filtered data is available
    if (Object.keys(filteredEmployeesData).length === 0) return;
    
    // Calculate which branches have employees for each status
    const pending = [];
    const assigned = [];
    const rejected = [];
    
    let pendingTotal = 0;
    let assignedTotal = 0;
    let rejectedTotal = 0;
    
    branches.forEach(branch => {
      const branchData = filteredEmployeesData[branch] || [];
      
      // Count each type
      let pendingCount = 0;
      let assignedCount = 0;
      let rejectedCount = 0;
      
      branchData.forEach(emp => {
        if (emp.status === 'assigned') {
          assignedCount++;
        } else if (emp.status === 'rejected') {
          rejectedCount++;
        } else {
          pendingCount++;
        }
      });
      
      // Add branch to list if it has employees of that status
      if (pendingCount > 0) pending.push(branch);
      if (assignedCount > 0) assigned.push(branch);
      if (rejectedCount > 0) rejected.push(branch);
      
      // Update totals
      pendingTotal += pendingCount;
      assignedTotal += assignedCount;
      rejectedTotal += rejectedCount;
    });
    
    // Update state with the branches to show
    setBranchesToShow({
      pending,
      assigned,
      rejected
    });
    
    // Update count states
    setPendingCount(pendingTotal);
    setAssignedCount(assignedTotal);
    setRejectedCount(rejectedTotal);
  }, [filteredEmployeesData, branches]);

  // Apply filters to all branches
  const applyFilters = useCallback(() => {
    const filteredData = {};
    
    Object.keys(allBranchesData).forEach(branch => {
      let filtered = [...allBranchesData[branch]];
      
      if (filterDate) {
        filtered = filtered.filter(emp => emp.date === filterDate);
      }
      
      if (filterSession) {
        filtered = filtered.filter(emp => emp.session === filterSession);
      }
      
      filteredData[branch] = filtered;
    });
    
    setFilteredEmployeesData(filteredData);
  }, [allBranchesData, filterDate, filterSession]);

  // Handle date filter change
  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };
  
  // Handle session filter change
  const handleSessionFilterChange = (session) => {
    setFilterSession(session === filterSession ? '' : session); // Toggle if same session clicked
  };

  // Apply filters when button is clicked
  const handleApplyFilters = () => {
    applyFilters();
    setShowFilterOptions(false);
  };

  // Clear filters
  const handleClearFilters = useCallback(() => {
    setFilterDate('');
    setFilterSession('');
    setFilteredEmployeesData(allBranchesData);
    setShowFilterOptions(false);
  }, [allBranchesData]);

  // Get employees by status (for tabs)
  const getEmployeesByStatus = useCallback((status, branch) => {
    if (!filteredEmployeesData[branch]) return [];
    
    return filteredEmployeesData[branch].filter(emp => {
      if (status === 'assigned') {
        return emp.status === 'assigned';
      } else if (status === 'rejected') {
        return emp.status === 'rejected';
      } else { // pending
        return emp.status !== 'assigned' && emp.status !== 'rejected';
      }
    });
  }, [filteredEmployeesData]);

  // Handle file upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        
        try {
          // Store the allocation data for all users to access
          localStorage.setItem('finalRoomAllocation', content);
          
          // Store upload timestamp
          localStorage.setItem('roomAllocationTimestamp', new Date().toISOString());
          
          setUploadStatus('Room allocation uploaded successfully!');
        } catch (error) {
          console.error('Error processing file:', error);
          setUploadStatus('Error processing file');
        }
      };
      
      reader.onerror = () => {
        setUploadStatus('Error reading file');
      };
      
      reader.readAsText(file);
    }
  };

  // Mark employee for assignment (first level - just visual)
  const handleMarkForAssignment = useCallback((branch, employeeId, date, session) => {
    // Create unique key for the employee
    const key = `${branch}_${employeeId}_${date}_${session}`;
    
    setMarkedEmployees(prevMarkedEmployees => {
      const updatedMarkedEmployees = { ...prevMarkedEmployees };
      
      // If already marked as rejected, remove that mark
      if (updatedMarkedEmployees[key] === 'rejected') {
        delete updatedMarkedEmployees[key];
      }
      
      // Toggle between unmarked and marked for assignment
      if (updatedMarkedEmployees[key] === 'forAssignment') {
        delete updatedMarkedEmployees[key];
      } else {
        updatedMarkedEmployees[key] = 'forAssignment';
      }
      
      return updatedMarkedEmployees;
    });
  }, []);

  // Mark employee for rejection (first level - just visual)
  const handleMarkForRejection = useCallback((branch, employeeId, date, session) => {
    // Create unique key for the employee
    const key = `${branch}_${employeeId}_${date}_${session}`;
    
    setMarkedEmployees(prevMarkedEmployees => {
      const updatedMarkedEmployees = { ...prevMarkedEmployees };
      
      // If already marked as for assignment, remove that mark
      if (updatedMarkedEmployees[key] === 'forAssignment') {
        delete updatedMarkedEmployees[key];
      }
      
      // Toggle between unmarked and marked for rejection
      if (updatedMarkedEmployees[key] === 'rejected') {
        delete updatedMarkedEmployees[key];
      } else {
        updatedMarkedEmployees[key] = 'rejected';
      }
      
      return updatedMarkedEmployees;
    });
  }, []);

  // Check if an employee is marked and how
  const getEmployeeMarkStatus = useCallback((branch, employeeId, date, session) => {
    const key = `${branch}_${employeeId}_${date}_${session}`;
    return markedEmployees[key] || null;
  }, [markedEmployees]);

  // Submit marked employees (go to review)
  const handleSubmitMarked = () => {
    // Check if any employees are marked for assignment
    const markedForAssignment = Object.entries(markedEmployees).filter(([_, status]) => status === 'forAssignment');
    
    if (markedForAssignment.length === 0) {
      alert("Please mark at least one employee for assignment before proceeding.");
      return;
    }
    
    setCurrentStage('review');
  };

  // Handle back to selection
  const handleBackToSelection = () => {
    setCurrentStage('selection');
  };

  // Handle final submit
  const handleFinalSubmit = useCallback(() => {
    // Update all branches data with the assignments and rejections
    const updatedBranchesData = { ...allBranchesData };
    
    // Process all marked employees
    Object.entries(markedEmployees).forEach(([key, status]) => {
      const [branch, employeeId, date, session] = key.split('_');
      
      // Find the employee in the branch data
      updatedBranchesData[branch] = updatedBranchesData[branch].map(emp => {
        if ((emp.id || emp.employeeId) === employeeId &&
            emp.date === date &&
            emp.session === session) {
          // Update status based on marking
          return { 
            ...emp, 
            status: status === 'forAssignment' ? 'assigned' : 'rejected' 
          };
        }
        return emp;
      });
      
      // Save updated data to localStorage
      localStorage.setItem(`employees_${branch}`, JSON.stringify(updatedBranchesData[branch]));
    });
    
    // Update state
    setAllBranchesData(updatedBranchesData);
    setFilteredEmployeesData(updatedBranchesData);
    
    // Clear markings
    setMarkedEmployees({});
    
    // Return to selection stage with success message
    setCurrentStage('selection');
    
    // Show success message
    alert("Employees have been successfully processed!");
  }, [allBranchesData, markedEmployees]);

  // Format month year string for display
  const formatMonthYear = useCallback((monthYearStr) => {
    const [year, month] = monthYearStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, []);

  // Group employees by month
  const getGroupedEmployeesByStatus = useCallback((status, branch) => {
    const statusEmployees = getEmployeesByStatus(status, branch);
    
    // First sort by date (ascending)
    const sortedByDate = [...statusEmployees].sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
    
    // Then group by month
    const grouped = {};
    sortedByDate.forEach(emp => {
      if (!emp.date) return;
      
      const date = new Date(emp.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      
      grouped[monthYear].push(emp);
    });
    
    return grouped;
  }, [getEmployeesByStatus]);

  // Get employees marked for assignment grouped by branch
  const getEmployeesMarkedForAssignmentByBranch = useCallback(() => {
    const result = {};
    
    // Get keys of employees marked for assignment
    const forAssignmentKeys = Object.entries(markedEmployees)
      .filter(([_, status]) => status === 'forAssignment')
      .map(([key]) => key);
    
    // Group by branch
    forAssignmentKeys.forEach(key => {
      const [branch, employeeId, date, session] = key.split('_');
      
      if (!result[branch]) {
        result[branch] = [];
      }
      
      // Find employee details
      const employee = filteredEmployeesData[branch]?.find(
        emp => (emp.id || emp.employeeId) === employeeId &&
        emp.date === date &&
        emp.session === session
      );
      
      if (employee) {
        result[branch].push(employee);
      }
    });
    
    return result;
  }, [markedEmployees, filteredEmployeesData]);

  // Render tabs with fixed count badges
  const renderTabs = () => {
    return (
      <div className="employee-status-tabs">
        <div 
          className={`status-tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('pending');
            setCurrentStage('selection'); // Reset to selection stage when switching to pending
          }}
        >
          Pending {pendingCount > 0 && <span className="status-count">{pendingCount}</span>}
        </div>
        <div 
          className={`status-tab ${activeTab === 'assigned' ? 'active' : ''}`}
          onClick={() => setActiveTab('assigned')}
        >
          Assigned {assignedCount > 0 && <span className="status-count">{assignedCount}</span>}
        </div>
        <div 
          className={`status-tab ${activeTab === 'rejected' ? 'active' : ''}`}
          onClick={() => setActiveTab('rejected')}
        >
          Rejected {rejectedCount > 0 && <span className="status-count">{rejectedCount}</span>}
        </div>
      </div>
    );
  };

  // Render the pending tab content
  const renderPendingTab = () => {
    // Counts for marked employees
    const markedForAssignmentCount = Object.values(markedEmployees).filter(status => status === 'forAssignment').length;
    const markedForRejectionCount = Object.values(markedEmployees).filter(status => status === 'rejected').length;
    
    // Check if there are any pending employees across all branches
    if (branchesToShow.pending.length === 0) {
      return (
        <div className="no-data-message">
          No pending employees to show.
        </div>
      );
    }
    
    return (
      <>
        {/* Filter Controls */}
        <div className="action-buttons">
          <button 
            className="filter-button"
            onClick={() => setShowFilterOptions(!showFilterOptions)}
            title="Filter Options"
          >
            <FaFilter />
          </button>
          
          <button 
            className="download-button"
            onClick={() => {
              // Generate CSV with all pending employees
              alert("Downloading pending employees list...");
            }}
            title="Download Pending Employees"
          >
            <FaDownload />
          </button>
        </div>

        {showFilterOptions && (
          <div className="filter-options">
            <div className="filter-option">
              <label><FaCalendarAlt /> Filter by Date:</label>
              <input 
                type="date" 
                value={filterDate} 
                onChange={handleDateFilterChange}
              />
            </div>
            
            <div className="filter-option">
              <label><FaClock /> Filter by Session:</label>
              <div className="session-filter-buttons">
                <button 
                  type="button"
                  className={`session-filter-btn ${filterSession === 'AM' ? 'active' : ''}`}
                  onClick={() => handleSessionFilterChange('AM')}
                >
                  AM
                </button>
                <button 
                  type="button"
                  className={`session-filter-btn ${filterSession === 'PM' ? 'active' : ''}`}
                  onClick={() => handleSessionFilterChange('PM')}
                >
                  PM
                </button>
              </div>
            </div>
            
            <div className="filter-actions">
              <button onClick={handleApplyFilters} className="apply-filter-btn">
                Apply Filters
              </button>
              <button onClick={handleClearFilters} className="clear-filter-btn">
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Employee Lists by Branch - FIXED: Only show branches with employees */}
        <div className="all-branches-container">
          {branchesToShow.pending.map(branch => (
            <div key={branch} className="branch-section">
              <h3 className="branch-title">{branch} Department</h3>
              
              {Object.entries(getGroupedEmployeesByStatus('pending', branch)).map(([monthYear, employees]) => (
                <div key={`${branch}_${monthYear}`} className="month-group">
                  <div className="month-header">
                    <h5>{formatMonthYear(monthYear)}</h5>
                    <span className="month-count">{employees.length} employees</span>
                  </div>
                  <div className="table-wrapper">
                    <table className="employee-table">
                      <thead>
                        <tr>
                          <th>Employee ID</th>
                          <th>Name</th>
                          <th>Designation</th>
                          <th>Date</th>
                          <th>Session</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee, index) => {
                          const markStatus = getEmployeeMarkStatus(
                            branch, 
                            employee.id || employee.employeeId, 
                            employee.date, 
                            employee.session
                          );
                          
                          return (
                            <tr 
                              key={index} 
                              className={markStatus ? `marked-${markStatus}` : ''}
                            >
                              <td>{employee.id || employee.employeeId}</td>
                              <td>{employee.name}</td>
                              <td>{employee.designation}</td>
                              <td>{new Date(employee.date).toLocaleDateString()}</td>
                              <td>
                                <span className={`session-badge ${employee.session || 'AM'}`}>
                                  {employee.session || 'AM'}
                                </span>
                              </td>
                              <td className="status-cell">
                                {markStatus === 'forAssignment' && (
                                  <span className="mark-status mark-for-assignment">
                                    <FaCircle className="status-dot" /> For Assignment
                                  </span>
                                )}
                                {markStatus === 'rejected' && (
                                  <span className="mark-status mark-for-rejection">
                                    <FaCircle className="status-dot" /> For Rejection
                                  </span>
                                )}
                                {!markStatus && (
                                  <span className="mark-status mark-none">
                                    Not Marked
                                  </span>
                                )}
                              </td>
                              <td className="employee-action-cell">
                                <div className="employee-actions">
                                  <button 
                                    className={`assign-btn ${markStatus === 'forAssignment' ? 'active' : ''}`}
                                    onClick={() => handleMarkForAssignment(
                                      branch, 
                                      employee.id || employee.employeeId, 
                                      employee.date, 
                                      employee.session
                                    )}
                                    title="Mark for Assignment"
                                  >
                                    <FaCheck />
                                  </button>
                                  <button 
                                    className={`reject-btn ${markStatus === 'rejected' ? 'active' : ''}`}
                                    onClick={() => handleMarkForRejection(
                                      branch, 
                                      employee.id || employee.employeeId, 
                                      employee.date, 
                                      employee.session
                                    )}
                                    title="Mark for Rejection"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Submit Button (only if employees are marked) */}
        {(markedForAssignmentCount > 0 || markedForRejectionCount > 0) && (
          <div className="submit-container">
            <div className="marked-counts">
              <div className="marked-count for-assignment">
                <FaCircle className="status-dot" /> {markedForAssignmentCount} Marked for Assignment
              </div>
              <div className="marked-count for-rejection">
                <FaCircle className="status-dot" /> {markedForRejectionCount} Marked for Rejection
              </div>
            </div>
            <button className="submit-btn first-level" onClick={handleSubmitMarked}>
              Submit Selection
            </button>
          </div>
        )}
      </>
    );
  };

  // Render the assigned tab content
  const renderAssignedTab = () => {
    // Check if any branches have assigned employees
    if (branchesToShow.assigned.length === 0) {
      return (
        <div className="no-data-message">
          No employees have been assigned yet.
        </div>
      );
    }
    
    return (
      <div className="all-branches-container">
        {branchesToShow.assigned.map(branch => (
          <div key={branch} className="branch-section">
            <h3 className="branch-title">{branch} Department</h3>
            
            {Object.entries(getGroupedEmployeesByStatus('assigned', branch)).map(([monthYear, employees]) => (
              <div key={`${branch}_${monthYear}`} className="month-group">
                <div className="month-header">
                  <h5>{formatMonthYear(monthYear)}</h5>
                  <span className="month-count">{employees.length} employees</span>
                </div>
                <div className="table-wrapper">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Date</th>
                        <th>Session</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={index} className="status-assigned">
                          <td>{employee.id || employee.employeeId}</td>
                          <td>{employee.name}</td>
                          <td>{employee.designation}</td>
                          <td>{new Date(employee.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`session-badge ${employee.session || 'AM'}`}>
                              {employee.session || 'AM'}
                            </span>
                          </td>
                          <td className="status-cell">
                            <span className="status-badge assigned">
                              <FaCircle className="status-dot" /> Assigned
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Render the rejected tab content
  const renderRejectedTab = () => {
    // Check if any branches have rejected employees
    if (branchesToShow.rejected.length === 0) {
      return (
        <div className="no-data-message">
          No employees have been rejected yet.
        </div>
      );
    }
    
    return (
      <div className="all-branches-container">
        {branchesToShow.rejected.map(branch => (
          <div key={branch} className="branch-section">
            <h3 className="branch-title">{branch} Department</h3>
            
            {Object.entries(getGroupedEmployeesByStatus('rejected', branch)).map(([monthYear, employees]) => (
              <div key={`${branch}_${monthYear}`} className="month-group">
                <div className="month-header">
                  <h5>{formatMonthYear(monthYear)}</h5>
                  <span className="month-count">{employees.length} employees</span>
                </div>
                <div className="table-wrapper">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Date</th>
                        <th>Session</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={index} className="status-rejected">
                          <td>{employee.id || employee.employeeId}</td>
                          <td>{employee.name}</td>
                          <td>{employee.designation}</td>
                          <td>{new Date(employee.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`session-badge ${employee.session || 'AM'}`}>
                              {employee.session || 'AM'}
                            </span>
                          </td>
                          <td className="status-cell">
                            <span className="status-badge rejected">
                              <FaCircle className="status-dot" /> Rejected
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  // Render the review stage
  const renderReviewStage = () => {
    // Get employees marked for assignment
    const markedEmployeesByBranch = getEmployeesMarkedForAssignmentByBranch();
    
    return (
      <div className="review-stage">
        <div className="review-header">
          <h3>Review Marked Employees</h3>
          <p>Please review the employees you have marked for assignment</p>
        </div>
        
        {Object.keys(markedEmployeesByBranch).length === 0 ? (
          <div className="no-data-message">
            No employees have been marked for assignment.
          </div>
        ) : (
          <>
            {Object.entries(markedEmployeesByBranch).map(([branch, employees]) => (
              <div key={branch} className="review-branch-section">
                <h4 className="review-branch-title">{branch} Department</h4>
                <div className="table-wrapper">
                  <table className="employee-table">
                    <thead>
                      <tr>
                        <th>Employee ID</th>
                        <th>Name</th>
                        <th>Designation</th>
                        <th>Date</th>
                        <th>Session</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee, index) => (
                        <tr key={index} className="marked-for-assignment">
                          <td>{employee.id || employee.employeeId}</td>
                          <td>{employee.name}</td>
                          <td>{employee.designation}</td>
                          <td>{new Date(employee.date).toLocaleDateString()}</td>
                          <td>
                            <span className={`session-badge ${employee.session || 'AM'}`}>
                              {employee.session || 'AM'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
            
            <div className="review-actions">
              <button className="edit-btn" onClick={handleBackToSelection}>
                <FaEdit /> Edit Selection
              </button>
              <button className="final-submit-btn" onClick={handleFinalSubmit}>
                <FaCheckDouble /> Final Submit
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-details">
        <span>Emp Name: {admin?.name}</span>
        <span className="dept">Dept: {admin?.department}</span>
      </div>
      
      <div className="exam-info">
        <h2>3rd year regular and supply examination 24-25</h2>
        <h3>Room and Staff Allocation</h3>
        
        {activeTab === 'pending' && currentStage === 'review' && (
          <div className="stage-indicator">
            Review Stage: Confirm Selection
          </div>
        )}
      </div>
      
      {/* Main Admin Actions */}
      <div className="main-actions-row">
        <div className="action-card employees-card">
          <h3>Employee Allocation Management</h3>
          
          {/* Status Tabs */}
          {renderTabs()}
          
          {/* Tab Content */}
          {activeTab === 'pending' && currentStage === 'selection' && renderPendingTab()}
          {activeTab === 'pending' && currentStage === 'review' && renderReviewStage()}
          {activeTab === 'assigned' && renderAssignedTab()}
          {activeTab === 'rejected' && renderRejectedTab()}
        </div>
        
        {/* Final Room Allocation */}
        <div className="action-card allocation-card">
          <h3>Final Room Allocation</h3>
          <p className="allocation-description">
            Upload CSV with room assignments (senior & junior professors)
          </p>
          
          <div className="upload-container">
            <button 
              className="upload-allocation-btn" 
              onClick={handleUploadButtonClick}
            >
              <FaFileUpload className="upload-icon" />
              Upload Allocation File
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              accept=".csv"
            />
          </div>
          
          {uploadedFile && (
            <div className="file-info">
              <p>Selected file: {uploadedFile.name}</p>
            </div>
          )}
          
          {uploadStatus && (
            <div className={`upload-status ${uploadStatus.includes('success') ? 'success' : 'error'}`}>
              {uploadStatus}
            </div>
          )}
          
          <div className="allocation-note">
            <p>Note: Each room requires one senior professor and one junior professor from the available employees list.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;