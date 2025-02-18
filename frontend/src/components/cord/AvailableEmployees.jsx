import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaSave, FaArrowLeft } from 'react-icons/fa';
import './Availableemployees.css';

const AvailableEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    department: '',
    designation: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEmployee = () => {
    if (!newEmployee.id || !newEmployee.name || !newEmployee.department || !newEmployee.designation) {
      alert('Please fill all fields');
      return;
    }
    
    setEmployees(prev => [...prev, { ...newEmployee }]);
    setNewEmployee({
      id: '',
      name: '',
      department: '',
      designation: ''
    });
  };

  const handleExport = () => {
    if (employees.length === 0) {
      alert('No employees added yet');
      return;
    }

    const headers = ['ID', 'Name', 'Department', 'Designation'];
    const csvContent = [
      headers.join(','),
      ...employees.map(emp => 
        [emp.id, emp.name, emp.department, emp.designation].join(',')
      )
    ].join('\n');

    localStorage.setItem('availableEmployees', JSON.stringify({
      employees,
      csvContent,
      uploadDate: new Date().toISOString()
    }));

    alert('Employee list saved successfully!');
  };

  return (
    <div className="available-employees-container">
      <div className="employees-card">
        <div className="employees-header">
          <h2 className="header-title">Available Employees List</h2>
          <button className="back-button" onClick={() => navigate('/cord')}>
            <FaArrowLeft /> Back to Dashboard
          </button>
        </div>

        <div className="input-section">
          <div className="input-grid">
            <div className="input-group">
              <label className="input-label">Employee ID</label>
              <input
                type="text"
                name="id"
                className="input-field"
                placeholder="Enter employee ID"
                value={newEmployee.id}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Name</label>
              <input
                type="text"
                name="name"
                className="input-field"
                placeholder="Enter employee name"
                value={newEmployee.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Department</label>
              <input
                type="text"
                name="department"
                className="input-field"
                placeholder="Enter department"
                value={newEmployee.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Designation</label>
              <input
                type="text"
                name="designation"
                className="input-field"
                placeholder="Enter designation"
                value={newEmployee.designation}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button className="add-button" onClick={handleAddEmployee}>
            <FaUserPlus /> Add Employee
          </button>
        </div>

        <div className="table-section">
          <table className="employees-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th>Designation</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.department}</td>
                  <td>{emp.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {employees.length > 0 && (
          <div className="save-section">
            <button className="save-button" onClick={handleExport}>
              <FaSave /> Save Employee List
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableEmployees;