import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload, FaChevronDown, FaFileUpload, FaFilter, FaSort, FaCalendarAlt, FaCheck, FaTimes, FaCircle, FaExclamationCircle, FaClock } from 'react-icons/fa';
import './Admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchEmployees, setBranchEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [filterDate, setFilterDate] = useState('');
  const [filterSession, setFilterSession] = useState(''); // Added session filter
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // State for rooms dropdown
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const roomsDropdownRef = useRef(null);
  
  // State for file upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  
  // State for showing filter options
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  // State for showing employee status tabs
  const [activeTab, setActiveTab] = useState('pending');

  // Building blocks with static room data
  const blocks = [
    { name: 'CB Block', rooms: 15 },
    { name: 'DG Block', rooms: 12 },
    { name: 'MN Block', rooms: 10 },
    { name: 'HT Block', rooms: 8 },
    { name: 'SJ Block', rooms: 14 }
  ];

  // Updated branches list to include all departments
  const branches = [
    'CSE', 'CSBS', 'CSE(DS)', 'CSE(AI&ML)', 'CSE(IOT)', 'IT', 
    'ECE', 'EEE', 'CIVIL', 'MECH', 'Chemical', 'MCA', 'MBA'
  ];

  useEffect(() => {
    if (!admin) {
      navigate('/admin');
    }

    // Add event listener to handle clicks outside dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (roomsDropdownRef.current && !roomsDropdownRef.current.contains(event.target)) {
        setShowRoomsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [navigate, admin]);

  useEffect(() => {
    // When selected branch changes, reset filter date and apply filtering
    if (branchEmployees.length > 0) {
      applyFilters();
    }
  }, [branchEmployees]);

  // Group employees by month
  const getGroupedEmployees = () => {
    if (!filteredEmployees.length) return {};
    
    // First sort by date (ascending)
    const sortedByDate = [...filteredEmployees].sort((a, b) => {
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
  };

  // Get employees by status (assigned, rejected, pending)
  const getEmployeesByStatus = (status) => {
    if (status === 'assigned') {
      return filteredEmployees.filter(emp => emp.status === 'assigned');
    } else if (status === 'rejected') {
      return filteredEmployees.filter(emp => emp.status === 'rejected');
    } else { // pending
      return filteredEmployees.filter(emp => emp.status !== 'assigned' && emp.status !== 'rejected');
    }
  };

  // Get grouped employees by status
  const getGroupedEmployeesByStatus = (status) => {
    const statusEmployees = getEmployeesByStatus(status);
    
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
  };

  // Format month year string for display
  const formatMonthYear = (monthYearStr) => {
    const [year, month] = monthYearStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setIsDropdownOpen(false);
    setFilterDate('');
    setFilterSession(''); // Reset session filter
    setActiveTab('pending'); // Reset tab to pending when changing branch

    // Get employee data for selected branch from localStorage
    const employeeData = localStorage.getItem(`employees_${branch}`);
    if (employeeData) {
      const parsedData = JSON.parse(employeeData);
      
      // Add status field if not present and ensure session field exists
      const dataWithStatusAndSession = parsedData.map(emp => ({
        ...emp,
        status: emp.status || null, // null = not decided, 'assigned' or 'rejected'
        session: emp.session || 'AM' // Default to AM if session not specified
      }));
      
      setBranchEmployees(dataWithStatusAndSession);
      setFilteredEmployees(dataWithStatusAndSession);
      
      // Reset sort config when branch changes
      setSortConfig({ key: null, direction: 'ascending' });
    } else {
      setBranchEmployees([]);
      setFilteredEmployees([]);
    }
  };

  const handleDownloadEmployeeList = () => {
    if (!selectedBranch) {
      alert('Please select a branch first');
      return;
    }

    // Generate CSV with session information
    const headers = ['ID', 'Name', 'Department', 'Designation', 'Date', 'Session', 'Status'];
    const csvRows = [
      headers.join(',')
    ];

    filteredEmployees.forEach(emp => {
      const row = [
        emp.id || emp.employeeId,
        emp.name,
        emp.department,
        emp.designation,
        emp.date,
        emp.session || 'AM', // Include session with AM as default
        emp.status || 'pending'
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = csvRows.join('\n');
    
    // Create downloadable blob
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBranch}_employees_with_sessions.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedData = [...filteredEmployees].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredEmployees(sortedData);
  };

  // Function to get sort indicator
  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Function to apply date filtering
  const applyFilters = () => {
    let filtered = [...branchEmployees];
    
    if (filterDate) {
      filtered = filtered.filter(emp => emp.date === filterDate);
    }
    
    if (filterSession) {
      filtered = filtered.filter(emp => emp.session === filterSession);
    }
    
    setFilteredEmployees(filtered);
  };

  // Handler for date filter change
  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };
  
  // Handler for session filter change
  const handleSessionFilterChange = (session) => {
    setFilterSession(session === filterSession ? '' : session); // Toggle if same session clicked
  };

  // Handler to apply filters when button is clicked
  const handleApplyFilters = () => {
    applyFilters();
    setShowFilterOptions(false);
  };

  // Handler to clear filters
  const handleClearFilters = () => {
    setFilterDate('');
    setFilterSession('');
    setFilteredEmployees(branchEmployees);
    setShowFilterOptions(false);
  };

  // Handlers for rooms dropdown
  const toggleRoomsDropdown = () => {
    setShowRoomsDropdown(!showRoomsDropdown);
  };

  const handleBlockSelect = (block) => {
    setSelectedBlock(block);
    
    // Show block details in a popup
    showBlockDetails(block);
  };
  
  // Function to display block rooms in a popup
  const showBlockDetails = (block) => {
    // Generate room numbers for this block
    const roomNumbers = [];
    
    // Add 3rd floor rooms (301-317) up to the limit for this block
    for (let i = 301; i <= 317 && i - 300 <= block.rooms; i++) {
      roomNumbers.push(i);
    }
    
    // Add 4th floor rooms (401-417) up to the limit for this block
    for (let i = 401; i <= 417 && i - 400 <= block.rooms; i++) {
      roomNumbers.push(i);
    }
    
    // Create a popup element
    const popup = document.createElement('div');
    popup.className = 'block-details-popup';
    
    // Create popup content with wrapper
    popup.innerHTML = `
      <div class="popup-content-wrapper">
        <button class="close-btn">&times;</button>
        <div class="popup-header">
          <h3>${block.name} Details</h3>
        </div>
        <div class="popup-content">
          <p><strong>${block.rooms} Rooms Available</strong></p>
          <p>Each Room: 42 Students</p>
          <p>Total Capacity: ${block.rooms * 42} Students</p>
          
          <div class="room-numbers-section">
            <h4>Available Rooms:</h4>
            <div class="room-numbers-grid">
              ${roomNumbers.map(num => `<div class="room-number">${num}</div>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Append popup to body
    document.body.appendChild(popup);
    
    // Add event listener to close button
    const closeBtn = popup.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(popup);
    });
    
    // Close popup when clicking outside the content
    popup.addEventListener('click', (e) => {
      if (!popup.querySelector('.popup-content-wrapper').contains(e.target)) {
        document.body.removeChild(popup);
      }
    });
  };
  
  // Handler for file upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Handler for file selection - Removed constraints
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        
        try {
          // Store the allocation data for all users to access without validation
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

  // Fixed: Modified to only mark specific employee record as assigned/rejected
  const handleAssignEmployee = (employeeId, date, session) => {
    // Update branchEmployees
    const updatedBranchEmployees = branchEmployees.map(emp => {
      // Match by ID, date AND session to only update the specific record
      if ((emp.id || emp.employeeId) === employeeId && emp.date === date && emp.session === session) {
        return { ...emp, status: 'assigned' };
      }
      return emp;
    });
    setBranchEmployees(updatedBranchEmployees);

    // Update filtered employees
    const updatedFilteredEmployees = filteredEmployees.map(emp => {
      // Match by ID, date AND session to only update the specific record
      if ((emp.id || emp.employeeId) === employeeId && emp.date === date && emp.session === session) {
        return { ...emp, status: 'assigned' };
      }
      return emp;
    });
    setFilteredEmployees(updatedFilteredEmployees);

    // Save updated data to localStorage
    if (selectedBranch) {
      localStorage.setItem(`employees_${selectedBranch}`, JSON.stringify(updatedBranchEmployees));
    }
  };

  // Fixed: Modified to only mark specific employee record as rejected
  const handleRejectEmployee = (employeeId, date, session) => {
    // Update branchEmployees
    const updatedBranchEmployees = branchEmployees.map(emp => {
      // Match by ID, date AND session to only update the specific record
      if ((emp.id || emp.employeeId) === employeeId && emp.date === date && emp.session === session) {
        return { ...emp, status: 'rejected' };
      }
      return emp;
    });
    setBranchEmployees(updatedBranchEmployees);

    // Update filtered employees
    const updatedFilteredEmployees = filteredEmployees.map(emp => {
      // Match by ID, date AND session to only update the specific record
      if ((emp.id || emp.employeeId) === employeeId && emp.date === date && emp.session === session) {
        return { ...emp, status: 'rejected' };
      }
      return emp;
    });
    setFilteredEmployees(updatedFilteredEmployees);

    // Save updated data to localStorage
    if (selectedBranch) {
      localStorage.setItem(`employees_${selectedBranch}`, JSON.stringify(updatedBranchEmployees));
    }
  };
  
  const pendingCount = getEmployeesByStatus('pending').length;

  return (
    <div className="admin-dashboard">
      <div className="admin-details">
        <span>Emp Name: {admin?.name}</span>
        <span className="dept">Dept: {admin?.department}</span>
      </div>
      
      <div className="exam-info">
        <h2>Regular and supply examination 24-25</h2>
        <h3>Room and Staff Allocation</h3>
      </div>
      
      {/* Available Rooms Section */}
      <div className="rooms-dropdown-container" ref={roomsDropdownRef}>
        <button 
          className="rooms-dropdown-btn" 
          onClick={toggleRoomsDropdown}
          onMouseEnter={() => setShowRoomsDropdown(true)}
          onMouseLeave={() => setShowRoomsDropdown(false)}
        >
          Available Rooms <FaChevronDown />
          
          {showRoomsDropdown && (
            <div 
              className="rooms-dropdown-content"
              onMouseEnter={() => setShowRoomsDropdown(true)}
              onMouseLeave={() => setShowRoomsDropdown(false)}
            >
              {blocks.map((block) => (
                <div 
                  key={block.name} 
                  className="block-item"
                  onClick={() => handleBlockSelect(block)}
                >
                  {block.name}
                </div>
              ))}
            </div>
          )}
        </button>
      </div>
      
      {/* Main Admin Actions - Now in a single row with two columns */}
      <div className="main-actions-row">
        {/* Left Column - Available Employees */}
        <div className="action-card employees-card">
          <h3>Employee Allocation Management</h3>
          <div className="action-buttons">
            <div className="dropdown-container" ref={dropdownRef}>
              <button 
                className="dropdown-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onMouseEnter={() => setIsDropdownOpen(true)}
              >
                {selectedBranch || 'Select Branch'}
                <FaChevronDown className="dropdown-icon" />
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="dropdown-menu"
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  {branches.map((branch) => (
                    <div
                      key={branch}
                      className="dropdown-item"
                      onClick={() => handleBranchSelect(branch)}
                    >
                      {branch}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {selectedBranch && (
              <>
                <button 
                  className="filter-button"
                  onClick={() => setShowFilterOptions(!showFilterOptions)}
                  title="Filter Options"
                >
                  <FaFilter />
                </button>
                
                <button 
                  className="download-button"
                  onClick={handleDownloadEmployeeList}
                  title="Download Employee List"
                >
                  <FaDownload />
                </button>
              </>
            )}
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

          {selectedBranch && (
            <div className="employee-status-tabs">
              <div 
                className={`status-tab ${activeTab === 'pending' ? 'active' : ''}`}
                onClick={() => setActiveTab('pending')}
              >
                Pending <span className="status-count">{getEmployeesByStatus('pending').length}</span>
                {activeTab !== 'pending' && pendingCount > 0 && (
                  <span className="pending-indicator" title="Employees need attention">
                    <FaExclamationCircle />
                  </span>
                )}
              </div>
              <div 
                className={`status-tab ${activeTab === 'assigned' ? 'active' : ''}`}
                onClick={() => setActiveTab('assigned')}
              >
                Assigned <span className="status-count">{getEmployeesByStatus('assigned').length}</span>
              </div>
              <div 
                className={`status-tab ${activeTab === 'rejected' ? 'active' : ''}`}
                onClick={() => setActiveTab('rejected')}
              >
                Rejected <span className="status-count">{getEmployeesByStatus('rejected').length}</span>
              </div>
            </div>
          )}

          {selectedBranch && filteredEmployees.length > 0 && (
            <div className="employee-table-container">
              <h4>
                Employee List - {selectedBranch} 
                {filterDate && ` (Date: ${filterDate})`}
                {filterSession && ` (Session: ${filterSession})`}
              </h4>
              <div className="table-actions">
                <span className="results-count">
                  {activeTab === 'pending' ? 'Pending' : activeTab === 'assigned' ? 'Assigned' : 'Rejected'}: 
                  {' '}{getEmployeesByStatus(activeTab).length} employees
                </span>
              </div>
              
              {Object.entries(getGroupedEmployeesByStatus(activeTab)).length > 0 ? (
                <div className="month-grouped-employees">
                  {Object.entries(getGroupedEmployeesByStatus(activeTab)).map(([monthYear, employees]) => (
                    <div key={monthYear} className="month-group">
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
                              <th>Department</th>
                              <th>Designation</th>
                              <th>Date</th>
                              <th>Session</th>
                              {activeTab === 'pending' && <th>Actions</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {employees.map((employee, index) => (
                              <tr key={index}>
                                <td>{employee.id || employee.employeeId}</td>
                                <td>{employee.name}</td>
                                <td>{employee.department}</td>
                                <td>{employee.designation}</td>
                                <td>{new Date(employee.date).toLocaleDateString()}</td>
                                <td>
                                  <span className={`session-badge ${employee.session || 'AM'}`}>
                                    {employee.session || 'AM'}
                                  </span>
                                </td>
                                {activeTab === 'pending' && (
                                  <td className="employee-action-cell">
                                    <div className="employee-actions">
                                      <button 
                                        className="assign-btn" 
                                        onClick={() => handleAssignEmployee(employee.id || employee.employeeId, employee.date, employee.session || 'AM')}
                                        title="Assign for Exam Duty"
                                      >
                                        <FaCheck />
                                      </button>
                                      <button 
                                        className="reject-btn" 
                                        onClick={() => handleRejectEmployee(employee.id || employee.employeeId, employee.date, employee.session || 'AM')}
                                        title="Reject for Exam Duty"
                                      >
                                        <FaTimes />
                                      </button>
                                    </div>
                                  </td>
                                )}
                                {activeTab === 'assigned' && (
                                  <td className="status-cell">
                                    <div className="status-indicator">
                                      <FaCircle className="status-dot assigned" />
                                    </div>
                                  </td>
                                )}
                                {activeTab === 'rejected' && (
                                  <td className="status-cell">
                                    <div className="status-indicator">
                                      <FaCircle className="status-dot rejected" />
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data-message">
                  No {activeTab} employees found for {selectedBranch} {filterDate && `on ${filterDate}`} {filterSession && `for ${filterSession} session`}
                </div>
              )}
            </div>
          )}
          
          {selectedBranch && filteredEmployees.length === 0 && (
            <div className="no-data-message">
              {filterDate || filterSession ? 
                `No employee data available for ${selectedBranch}${filterDate ? ` on ${filterDate}` : ''}${filterSession ? ` for ${filterSession} session` : ''}` : 
                `No employee data available for ${selectedBranch}`
              }
            </div>
          )}
        </div>
        
        {/* Right Column - Final Room Allocation */}
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