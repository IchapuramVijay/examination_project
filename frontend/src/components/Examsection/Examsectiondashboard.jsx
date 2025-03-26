import React, { useState } from 'react';
import './Examsectiondashboard.css';

const ExamDashboard = () => {
  // List of all branches
  const branches = [
    'CSE',
    'CSBS',
    'CSD',
    'CSE(AI & ML)',
    'CSE(IOT)',
    'IT',
    'ECE',
    'EEE',
    'CIVIL',
    'MECH',
    'MBA',
    'MCA'
  ];

  // Initial state with empty dates
  const [examDates, setExamDates] = useState([
    { date: '', amValues: {}, pmValues: {} }
  ]);
  
  // State to track which fields are currently focused
  const [focusedFields, setFocusedFields] = useState({});

  // Add a new date row
  const addDateRow = () => {
    setExamDates([...examDates, { date: '', amValues: {}, pmValues: {} }]);
  };

  // Remove a date row
  const removeDateRow = (index) => {
    if (examDates.length > 1) {
      setExamDates(examDates.filter((_, i) => i !== index));
    }
  };

  // Handle date change
  const handleDateChange = (index, value) => {
    const newDates = [...examDates];
    newDates[index].date = value;
    setExamDates(newDates);
  };

  // Set field value
  const setFieldValue = (dateIndex, session, branch, value) => {
    // Only allow numeric input
    if (/^\d*$/.test(value)) {
      const newDates = [...examDates];
      if (session === 'AM') {
        newDates[dateIndex].amValues = {
          ...newDates[dateIndex].amValues,
          [branch]: value
        };
      } else {
        newDates[dateIndex].pmValues = {
          ...newDates[dateIndex].pmValues,
          [branch]: value
        };
      }
      setExamDates(newDates);
    }
  };

  // Handle field focus
  const handleFocus = (dateIndex, session, branch) => {
    // Track this field as focused
    setFocusedFields({
      ...focusedFields,
      [`${dateIndex}-${session}-${branch}`]: true
    });
  };

  // Handle field blur
  const handleBlur = (dateIndex, session, branch, value) => {
    // Mark field as not focused
    const newFocusedFields = { ...focusedFields };
    delete newFocusedFields[`${dateIndex}-${session}-${branch}`];
    setFocusedFields(newFocusedFields);

    // If field is empty after blur, set value to '0'
    if (value === '') {
      setFieldValue(dateIndex, session, branch, '0');
    }
  };

  // Get display value for an input field
  const getDisplayValue = (dateIndex, session, branch) => {
    const values = session === 'AM' 
      ? examDates[dateIndex].amValues 
      : examDates[dateIndex].pmValues;
    
    const value = values[branch];
    
    // If field is focused, show actual value (even if empty)
    const fieldKey = `${dateIndex}-${session}-${branch}`;
    if (focusedFields[fieldKey]) {
      return value || '';
    }
    
    // Otherwise, show '0' for empty or undefined values
    return value || '0';
  };

  // Check if a field should use the "default-zero" style
  const isDefaultZero = (dateIndex, session, branch) => {
    const values = session === 'AM' 
      ? examDates[dateIndex].amValues 
      : examDates[dateIndex].pmValues;
    
    const value = values[branch];
    return !value || value === '0';
  };

  // Handle form submission
  const handleUpload = () => {
    // Calculate total invigilators for each branch
    const branchData = {};
    branches.forEach(branch => {
      let total = 0;
      examDates.forEach(dateObj => {
        const amValue = dateObj.amValues[branch] || '0';
        const pmValue = dateObj.pmValues[branch] || '0';
        total += parseInt(amValue) + parseInt(pmValue);
      });
      branchData[branch] = total;
    });

    const totalInvigilators = Object.values(branchData).reduce((sum, count) => sum + count, 0);

    // Prepare data for storage
    const dataToStore = {
      examDates,
      branchData,
      totalInvigilators,
      uploadDate: new Date().toISOString()
    };

    localStorage.setItem('invigilatorData', JSON.stringify(dataToStore));
    alert('Data uploaded successfully!');
  };

  return (
    <div className="exam-dashboard-container">
      <div className="exam-dashboard-header">
        <h1>Exam Section Dashboard</h1>
        <p>Enter Number of Invigilators Required for Each Branch</p>
      </div>

      <div className="schedule-table-container">
        <table className="schedule-table">
          <thead>
            <tr>
              <th>Branch</th>
              {examDates.map((dateObj, index) => (
                <React.Fragment key={index}>
                  <th colSpan="2" className="date-column">
                    <div className="date-picker-container">
                      <input
                        type="date"
                        value={dateObj.date}
                        onChange={(e) => handleDateChange(index, e.target.value)}
                        className="date-picker"
                      />
                      {examDates.length > 1 && (
                        <button 
                          onClick={() => removeDateRow(index)}
                          className="remove-date-btn"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    <div className="session-labels">
                      <span>AM</span>
                      <span>PM</span>
                    </div>
                  </th>
                </React.Fragment>
              ))}
              <th>
                <button 
                  onClick={addDateRow}
                  className="add-date-btn"
                >
                  + Add Date
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {branches.map(branch => (
              <tr key={branch}>
                <td className="branch-name">{branch}</td>
                {examDates.map((dateObj, dateIndex) => (
                  <React.Fragment key={dateIndex}>
                    <td>
                      <input
                        type="text"
                        className={`count-input ${isDefaultZero(dateIndex, 'AM', branch) ? 'default-zero' : 'user-entered'}`}
                        value={getDisplayValue(dateIndex, 'AM', branch)}
                        onChange={(e) => setFieldValue(dateIndex, 'AM', branch, e.target.value)}
                        onFocus={() => handleFocus(dateIndex, 'AM', branch)}
                        onBlur={(e) => handleBlur(dateIndex, 'AM', branch, e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`count-input ${isDefaultZero(dateIndex, 'PM', branch) ? 'default-zero' : 'user-entered'}`}
                        value={getDisplayValue(dateIndex, 'PM', branch)}
                        onChange={(e) => setFieldValue(dateIndex, 'PM', branch, e.target.value)}
                        onFocus={() => handleFocus(dateIndex, 'PM', branch)}
                        onBlur={(e) => handleBlur(dateIndex, 'PM', branch, e.target.value)}
                      />
                    </td>
                  </React.Fragment>
                ))}
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="upload-btn" onClick={handleUpload}>
        Upload Data
      </button>
    </div>
  );
};

export default ExamDashboard;