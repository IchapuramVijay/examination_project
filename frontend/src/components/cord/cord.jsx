import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cord.css';

const Cord = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [employeeDetails, setEmployeeDetails] = useState({
    employeeId: '',
    name: '',
    designation: ''
  });
  const [employeeList, setEmployeeList] = useState([]);

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

    // Load existing employee list
    const savedEmployees = localStorage.getItem(`employees_${data.branch}`);
    if (savedEmployees) {
      setEmployeeList(JSON.parse(savedEmployees));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogout = () => {
    localStorage.removeItem('coordinatorData');
    navigate('/coordinator', { replace: true });
  };

  const handleAddEmployee = () => {
    if (!employeeDetails.employeeId || !employeeDetails.name || !employeeDetails.designation) {
      alert('Please fill all the fields');
      return;
    }

    if (employeeList.some(emp => emp.employeeId === employeeDetails.employeeId)) {
      alert('Employee ID already exists');
      return;
    }

    const newList = [...employeeList, {
      ...employeeDetails,
      department: userData.branch
    }];

    setEmployeeList(newList);
    localStorage.setItem(`employees_${userData.branch}`, JSON.stringify(newList));

    setEmployeeDetails({
      employeeId: '',
      name: '',
      designation: ''
    });
  };

  const handleRemoveEmployee = (index) => {
    const newList = employeeList.filter((_, i) => i !== index);
    setEmployeeList(newList);
    localStorage.setItem(`employees_${userData.branch}`, JSON.stringify(newList));
  };

  const handleSubmitEmployees = () => {
    if (employeeList.length === 0) {
      alert('Please add at least one employee');
      return;
    }

    const headers = ['Employee ID', 'Name', 'Department', 'Designation'];
    const csvData = employeeList.map(emp => [
      emp.employeeId,
      emp.name,
      emp.department,
      emp.designation
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');
    
    localStorage.setItem(`employeesCSV_${userData.branch}`, csvContent);
    localStorage.setItem(`availableEmployees_${userData.branch}`, JSON.stringify(employeeList));
    
    alert('Employee details have been submitted successfully');
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

  if (!userData) return null;

  return (
    <div className="coordinator-panel">
      <div className="main-header">
        <h1>Coordinator Panel - {userData.branch}</h1>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </div>

      <div className="content-section">
        <div className="staff-management-card">
          <h2>Staff Availability Management</h2>
          <div className="employee-form-container">
            <div className="employee-form-grid">
              <div className="form-group">
                <label htmlFor="employeeId">Employee ID</label>
                <input
                  id="employeeId"
                  type="text"
                  name="employeeId"
                  value={employeeDetails.employeeId}
                  onChange={handleInputChange}
                  placeholder="Enter ID"
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={employeeDetails.name}
                  onChange={handleInputChange}
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  type="text"
                  name="designation"
                  value={employeeDetails.designation}
                  onChange={handleInputChange}
                  placeholder="Enter designation"
                />
              </div>
            </div>
            <div className="form-buttons">
              <button 
                className="action-button add-button"
                onClick={handleAddEmployee}
              >
                Add Employee
              </button>
            </div>
          </div>

          {employeeList.length > 0 && (
            <div className="employee-table-container">
              <h3>Added Employees</h3>
              <div className="table-wrapper">
                <table className="employee-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Name</th>
                      <th>Department</th>
                      <th>Designation</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeList.map((emp, index) => (
                      <tr key={index}>
                        <td>{emp.employeeId}</td>
                        <td>{emp.name}</td>
                        <td>{userData.branch}</td>
                        <td>{emp.designation}</td>
                        <td>
                          <button 
                            className="remove-button"
                            onClick={() => handleRemoveEmployee(index)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="submit-button-container">
                <button 
                  className="action-button submit-button"
                  onClick={handleSubmitEmployees}
                >
                  Submit All Employees
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="exam-schedule-card">
          <h2>Required Employees Schedule </h2>
          <div className="schedule-content">
            <p className="description">
              Access and download the current examination schedule.
            </p>
            <button 
              className="action-button"
              onClick={handleExamScheduleDownload}
            >
              Download Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cord;