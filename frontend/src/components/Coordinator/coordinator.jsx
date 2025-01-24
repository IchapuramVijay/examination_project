import React, { useState } from 'react';
import './coordinator.css';
import collegelogo from '../../assets/collegelogo.jpg';

const Coordinator = () => {
 const [coordinatorId, setCoordinatorId] = useState('');
 const [password, setPassword] = useState('');

 const handleSubmit = (e) => {
   e.preventDefault();
 };

 return (
     <form className="coordinator-login-form" onSubmit={handleSubmit}>
     <img src={collegelogo} alt="College Logo" className="coordinator-college-logo" />
     <div className="coordinator-form-content">
       <div className="coordinator-form-group">
         <label>Coordinator id :</label>
         <input
           type="text"
           value={coordinatorId}
           onChange={(e) => setCoordinatorId(e.target.value)}
         />
       </div>
       <div className="coordinator-form-group">
         <label>Password :</label>
         <input
           type="password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
         />
       </div>
       <button type="submit" className="coordinator-submit-btn">Submit</button>
     </div>
   </form>
 );
};

export default Coordinator;