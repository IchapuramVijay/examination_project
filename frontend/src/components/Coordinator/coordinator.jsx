import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './coordinator.css';
import collegelogo from '../../assets/collegelogo.jpg';

const Coordinator = () => {
 const [coordinatorId, setCoordinatorId] = useState('');
 const [password, setPassword] = useState('');
 const navigate = useNavigate();

 const employeeData = {
  id: '123',
  name: 'John Doe',
  department: 'Computer Science',
  assignedInvigilators: 5,
};

 const handleSubmit = (e) => {
   e.preventDefault();
   if (coordinatorId === employeeData.id) {
    // On successful login, redirect to the dashboard and pass employee data
    navigate('/cord', { state:
       { name: employeeData.name, 
        department: employeeData.department,
         assignedInvigilators: employeeData.assignedInvigilators 
        },
       });
  } else {
    // Handle login failure (e.g., show an error message)
    alert('Invalid Coordinator ID');
  }
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