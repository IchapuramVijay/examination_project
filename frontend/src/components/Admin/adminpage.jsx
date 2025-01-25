import React, { useState } from 'react';
import './admin.css';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../auth/Adminauth';

import collegelogo from '../../assets/collegelogo.jpg';

const Admin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const result = adminLogin(adminId, password);
    if (result.status === "success") {
      localStorage.setItem('admin', JSON.stringify(result.data));
      navigate('/admindashboard');
    } else {
      alert(result.message);
    }
  }

  return (
      <form className="admin-login-form" onSubmit={handleSubmit}>
      <img src={collegelogo} alt="College Logo" className="admin-college-logo" />
      <div className="admin-form-content">
        <div className="admin-form-group">
          <label>Admin id :</label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
        </div>
        <div className="admin-form-group">
          <label>Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="admin-submit-btn">Submit</button>
      </div>
    </form>
  );
};

export default Admin;