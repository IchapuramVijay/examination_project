// src/components/Dashboard/Dashboard.jsx
import React from 'react';
import { FaDownload } from 'react-icons/fa';
import collegelogo from '../../../assets/collegelogo.jpg';
import './Employeedashboard.css';

const EmployeeDashboard = () => {
 const user = JSON.parse(localStorage.getItem('user'));

 const handleDownload = () => {
   // Add download functionality here
   console.log("Downloading allocation list...");
 };

 return (
   <div className="dashboard-container">
     <div className="user-info">
       <div className="college-logo-container">
         <img src={collegelogo} alt="College Logo" className="dashboard-college-logo" />
       </div>
       <div className="emp-details">
         <p>Emp Name: {user?.name}</p>
         <p>Dept: {user?.department}</p>
       </div>
     </div>

     <div className="exam-info">
       <h2>3rd year regular and supply examination 24-25</h2>
       <h3>Room and Staff Allocation</h3>
     </div>

     <div className="download-section">
       <p>Invigilators and rooms allocation list for exams</p>
       <button onClick={handleDownload} className="download-btn">
         <FaDownload size={30} color="green" />
       </button>
     </div>
   </div>
 );
};

export default EmployeeDashboard;