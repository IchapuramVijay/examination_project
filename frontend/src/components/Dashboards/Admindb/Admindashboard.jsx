import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUpload, FaDownload } from 'react-icons/fa';
import './Admindashboard.css'

const AdminDashboard = () => {
 const navigate = useNavigate();
 const admin = JSON.parse(localStorage.getItem('admin'));

 useEffect(() => {
   if (!admin) {
     navigate('/admin');
   }
 }, [navigate]);

 return (
   <div className="admin-dashboard">
       <div className="admin-details">
         <span>Emp Name: {admin?.name}</span>
         <span>Dept: {admin?.department}</span>
       </div>
       <div className="exam-info">
         <h2>3rd year regular and supply examination 24-25</h2>
         <h3>Room and Staff Allocation</h3>
       </div>
     
     
     <div className="admin-actions">
       <div className="action-card">
         <h3>No. of invigilator assigned</h3>
         <div className="action-buttons">
           <FaUpload className="upload-icon" title="Upload" />
           <FaDownload className="download-icon" title="Download" />
         </div>
       </div>
       <div className="action-card">
         <h3>Invigilator Allocated File From each Dept</h3>
         <div className="action-buttons">
           <FaUpload className="upload-icon" title="Upload" />
           <FaDownload className="download-icon" title="Download" />
         </div>
       </div>
       <div className="action-card">
         <h3>Total rooms and strength of students</h3>
         <div className="action-buttons">
           <FaUpload className="upload-icon" title="Upload" />
           <FaDownload className="download-icon" title="Download" />
         </div>
       </div>
       <div className="action-card">
         <h3>Final invigilators and rooms allocation list for exams</h3>
         <div className="action-buttons">
           <FaUpload className="upload-icon" title="Upload" />
           <FaDownload className="download-icon" title="Download" />
         </div>
       </div>
     </div>
   </div>
 );
};

export default AdminDashboard;