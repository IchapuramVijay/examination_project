import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload, FaChevronDown, FaFileUpload } from 'react-icons/fa';
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
  };
  
  // Handler for file upload button click
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };
  
  // Handler for file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setUploadStatus('Please upload a CSV file');
        return;
      }
      
      setUploadedFile(file);
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const content = e.target.result;
        
        try {
          // Validate CSV format - check if it has the expected structure
          const lines = content.split('\n');
          if (lines.length < 2) {
            setUploadStatus('CSV file is empty or invalid');
            return;
          }
          
          const headers = lines[0].split(',');
          // Check if the CSV has the required columns
          const requiredColumns = ['Room', 'Block', 'Senior Professor', 'Junior Professor'];
          const hasRequiredColumns = requiredColumns.every(col => 
            headers.some(header => header.trim().includes(col))
          );
          
          if (!hasRequiredColumns) {
            setUploadStatus('CSV file is missing required columns');
            return;
          }
          
          // Store the allocation data for all users to access
          localStorage.setItem('finalRoomAllocation', content);
          
          // Store upload timestamp
          localStorage.setItem('roomAllocationTimestamp', new Date().toISOString());
          
          setUploadStatus('Room allocation uploaded successfully!');
          
          // The data is now available for exam section and employees
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

  return (
    <div className="admin-dashboard">
      <div className="admin-details">
        <span>Emp Name: {admin?.name}</span>
        <span>Dept: {admin?.department}</span>
      </div>
      
      <div className="exam-info">
        <h2>Regular and supply examination 24-25</h2>
        <h3>Room and Staff Allocation</h3>
      </div>
      
      {/* Available Rooms Section */}
      <div className="rooms-dropdown-container" ref={roomsDropdownRef}>
        <button 
          className="rooms-dropdown-btn" 
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
                  onMouseEnter={() => handleBlockSelect(block)}
                >
                  {block.name}
                  
                  {selectedBlock && selectedBlock.name === block.name && (
                    <div className="rooms-detail">
                      <p>{block.rooms} Rooms Available</p>
                      <p>Each Room: 42 Students</p>
                      <p>Total Capacity: {block.rooms * 42} Students</p>
                    </div>
                  )}
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
              accept=".csv"
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
      
      {/* Additional Admin Actions */}
      <div className="admin-actions">
        <div className="action-card">
          <h3>Required Employees From Exam Section</h3>
          <div className="action-buttons">
            <FaDownload className="download-icon" title="Download" />
          </div>
        </div>
        
       
      </div>
    </div>
  );
};

export default AdminDashboard;