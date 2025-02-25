// Updated EmployeeDashboard.jsx to show room allocation
import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import collegelogo from '../../../assets/collegelogo.jpg';
import './Employeedashboard.css';

const EmployeeDashboard = () => {
 const user = JSON.parse(localStorage.getItem('user'));
 const [allocationData, setAllocationData] = useState(null);
 const [userAllocation, setUserAllocation] = useState(null);
 const [lastUpdated, setLastUpdated] = useState(null);

 useEffect(() => {
   // Check if there's a room allocation available
   const allocData = localStorage.getItem('finalRoomAllocation');
   const timestamp = localStorage.getItem('roomAllocationTimestamp');
   
   if (allocData && user) {
     try {
       // Parse the CSV data
       const lines = allocData.split('\n');
       const headers = lines[0].split(',').map(header => header.trim());
       
       // Find indices for needed columns
       const roomIndex = headers.findIndex(h => h.includes('Room'));
       const blockIndex = headers.findIndex(h => h.includes('Block'));
       const seniorProfIndex = headers.findIndex(h => h.includes('Senior Professor'));
       const juniorProfIndex = headers.findIndex(h => h.includes('Junior Professor'));
       
       // Check if all needed columns exist
       if (roomIndex >= 0 && blockIndex >= 0 && seniorProfIndex >= 0 && juniorProfIndex >= 0) {
         // Process the data
         const parsedData = [];
         for (let i = 1; i < lines.length; i++) {
           if (!lines[i].trim()) continue; // Skip empty lines
           
           const values = lines[i].split(',').map(val => val.trim());
           parsedData.push({
             room: values[roomIndex],
             block: values[blockIndex],
             seniorProfessor: values[seniorProfIndex],
             juniorProfessor: values[juniorProfIndex]
           });
         }
         
         setAllocationData(parsedData);
         
         // Find the current user's allocation
         const userAsSenior = parsedData.find(item => 
           item.seniorProfessor.includes(user.name)
         );
         
         const userAsJunior = parsedData.find(item => 
           item.juniorProfessor.includes(user.name)
         );
         
         if (userAsSenior) {
           setUserAllocation({
             ...userAsSenior,
             role: 'Senior Professor'
           });
         } else if (userAsJunior) {
           setUserAllocation({
             ...userAsJunior,
             role: 'Junior Professor'
           });
         }
         
         // Format the timestamp
         if (timestamp) {
           const date = new Date(timestamp);
           setLastUpdated(date.toLocaleString());
         }
       }
     } catch (error) {
       console.error('Error parsing room allocation data:', error);
     }
   }
 }, [user]);

 const handleDownload = () => {
   // Download allocation data as CSV
   if (allocationData) {
     const headers = 'Room,Block,Senior Professor,Junior Professor\n';
     const csvRows = allocationData.map(item => 
       `${item.room},${item.block},${item.seniorProfessor},${item.juniorProfessor}`
     );
     
     const csvContent = headers + csvRows.join('\n');
     const blob = new Blob([csvContent], { type: 'text/csv' });
     const url = window.URL.createObjectURL(blob);
     const link = document.createElement('a');
     link.href = url;
     link.download = 'room_allocation.csv';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     URL.revokeObjectURL(url);
   }
 };

 return (
    <div className="dashboard-container">
      <div className="header-section">
        <div className="logo-section">
          <img src={collegelogo} alt="College Logo" className="dashboard-college-logo" />
        </div>
        <div className="info-section">
          <div className="emp-details">
            <p>Emp Name: {user?.name}</p>
            <p>Dept: {user?.department}</p>
          </div>
          <div className="exam-info">
            <h2>Regular and supply examination 24-25</h2>
            <h3>Room and Staff Allocation</h3>
          </div>
        </div>
      </div>
 
      <div className="allocation-section">
        {userAllocation ? (
          <div className="user-allocation">
            <h3>Your Room Assignment</h3>
            <div className="allocation-details">
              <div className="allocation-item">
                <span className="allocation-label">Block:</span>
                <span className="allocation-value">{userAllocation.block}</span>
              </div>
              <div className="allocation-item">
                <span className="allocation-label">Room:</span>
                <span className="allocation-value">{userAllocation.room}</span>
              </div>
              <div className="allocation-item">
                <span className="allocation-label">Role:</span>
                <span className="allocation-value">{userAllocation.role}</span>
              </div>
              <div className="allocation-item">
                <span className="allocation-label">Senior Professor:</span>
                <span className="allocation-value">{userAllocation.seniorProfessor}</span>
              </div>
              <div className="allocation-item">
                <span className="allocation-label">Junior Professor:</span>
                <span className="allocation-value">{userAllocation.juniorProfessor}</span>
              </div>
            </div>
            
            {lastUpdated && (
              <div className="last-updated">
                Last updated: {lastUpdated}
              </div>
            )}
          </div>
        ) : (
          <div className="no-allocation">
            <p>You have not been assigned to any room yet.</p>
          </div>
        )}
      </div>
 
      <div className="download-section">
        <p>Invigilators and rooms allocation list for exams</p>
        <button onClick={handleDownload} className="download-btn" disabled={!allocationData}>
          <FaDownload size={30} color={allocationData ? "green" : "gray"} />
        </button>
      </div>
    </div>
  );
 };

export default EmployeeDashboard;