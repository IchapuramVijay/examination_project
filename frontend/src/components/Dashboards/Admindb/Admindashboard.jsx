import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload, FaChevronDown } from 'react-icons/fa';
import './Admindashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchEmployees, setBranchEmployees] = useState([]);
  const dropdownRef = useRef(null);

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
      
      <div className="admin-actions">
        <div className="action-card">
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

        <div className="action-card">
          <h3>Invigilator Allocated File From each Dept</h3>
          <div className="action-buttons">
           
            <FaDownload className="download-icon" title="Download" />
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default AdminDashboard;