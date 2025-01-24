import React, { useState } from 'react';
import './Admin.css';
import collegelogo from '../../assets/collegelogo.jpg';
import Header from '../header/header';

const Admin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="admin-container">
      <form onSubmit={handleSubmit} className="admin-form">
        <img src={collegelogo} alt="College Logo" className="college-logo" />
        <div className="form-fields">
          <div className="form-group">
            <label>Admin Id:</label>
            <input
              type="text"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password :</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default Admin;