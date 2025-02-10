import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../auth/auth';
import './Home.css';
import collegelogo from '../../assets/collegelogo.jpg';

const Home = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(employeeId, password);
    if (result.status === "success") {
      localStorage.setItem('user', JSON.stringify(result.data));
      navigate('/dashboard');
    } else {
      alert(result.message);
    }
  };

  return (
      <form className="login-form" onSubmit={handleSubmit}>
      <img src={collegelogo} alt="College Logo" className="college-logo" />
      <div className="form-content">
        <div className="form-group">
          <label>Employee id :</label>
          <input
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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
  );
};

export default Home;