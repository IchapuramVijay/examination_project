import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload, FaChevronDown, FaFileUpload, FaUserFriends } from 'react-icons/fa';
import './Admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchEmployees, setBranchEmployees] = useState([]);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // State for rooms dropdown
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const roomsDropdownRef = useRef(null);
  
  // State for file upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  // Building blocks with static room data
  const blocks = [
    { name: 'CB Block', rooms: 15 },
    { name: 'DG Block', rooms: 12 },
    { name: 'MN Block', rooms: 10 },
    { name: 'HT Block', rooms: 8 },
    { name: 'SJ Block', rooms: 14 }
  ];

  const branches = ['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH'];

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
  }, [navigate]);

  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch);
    setIsDropdownOpen(false);

    // Get employee data for selected branch from localStorage
    const employeeData = localStorage.getItem(`availableEmployees_${branch}`);
    if (employeeData) {
      setBranchEmployees(JSON.parse(employeeData));
    } else {
      setBranchEmployees([]);
    }
  };

  const handleDownloadEmployeeList = () => {
    if (!selectedBranch) {
      alert('Please select a branch first');
      return;
    }

    const csvData = localStorage.getItem(`employeesCSV_${selectedBranch}`);
    if (!csvData) {
      alert('No employee data available for this branch');
      return;
    }

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedBranch}_employees.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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

  // Function to handle download of required employees from Exam Section
  const handleDownloadExamSchedule = () => {
    try {
      // Get the exam schedule from localStorage
      const examScheduleData = localStorage.getItem('examSchedule');
      if (!examScheduleData) {
        alert('No examination schedule data available. Please wait for the Exam Section to submit a schedule.');
        return;
      }
      
      let csvContent = "";
      
      // First try to parse the data
      const parsedData = JSON.parse(examScheduleData);
      
      // Check which format the data is in (from ExamScheduleTable or ExamDashboard)
      if (parsedData.csvContent) {
        // Data is in the format from ExamScheduleTable
        csvContent = parsedData.csvContent;
      } else {
        // Data is in the format from ExamDashboard
        // Generate CSV header
        csvContent = 'Branch,';
        
        // Get days and periods
        // We need to find the pattern like Day1AM, Day1PM, etc.
        const firstBranch = Object.keys(parsedData)[0];
        if (firstBranch && parsedData[firstBranch]) {
          const dayPeriods = Object.keys(parsedData[firstBranch]);
          
          // Sort the day periods to ensure they're in order
          dayPeriods.sort();
          
          // Create the header row
          dayPeriods.forEach(dp => {
            // Format: change Day1AM to Day 1 AM
            const formattedDP = dp.replace(/Day(\d+)([A-Z]+)/, 'Day $1 $2');
            csvContent += formattedDP + ',';
          });
          
          csvContent = csvContent.slice(0, -1) + '\n';
          
          // Add data for each branch
          Object.keys(parsedData).forEach(branch => {
            csvContent += branch + ',';
            dayPeriods.forEach(dp => {
              csvContent += (parsedData[branch][dp] || '0') + ',';
            });
            csvContent = csvContent.slice(0, -1) + '\n';
          });
        }
      }
      
      if (!csvContent) {
        alert('Could not generate CSV from the schedule data.');
        return;
      }
      
      // Download the CSV
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'required_invigilators.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading exam schedule:', error);
      alert('Error processing examination schedule data');
    }
  };

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
          <h3>Available Employees by Department</h3>
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
              <button 
                className="download-button"
                onClick={handleDownloadEmployeeList}
                title="Download Employee List"
              >
                <FaDownload />
              </button>
            )}
          </div>

          {selectedBranch && branchEmployees.length > 0 && (
            <div className="employee-table-container">
              <h4>Employee List - {selectedBranch}</h4>
              <div className="table-wrapper">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branchEmployees.map((employee, index) => (
                      <tr key={index}>
                        <td>{employee.employeeId}</td>
                        <td>{employee.name}</td>
                        <td>{employee.department}</td>
                        <td>{employee.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {selectedBranch && branchEmployees.length === 0 && (
            <div className="no-data-message">
              No employee data available for {selectedBranch}
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
      
      {/* Required Employees Section */}
      <div className="admin-actions">
        <div className="action-card requirement-card">
          <h3>Required Employees</h3>
          <p className="requirement-description">
            Download the required employees data submitted by the Exam Section
          </p>
          <div className="action-buttons requirement-buttons">
            <button 
              className="requirement-download-btn"
              onClick={handleDownloadExamSchedule}
            >
              <FaUserFriends className="requirement-icon" />
              <span>Download Requirements</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;