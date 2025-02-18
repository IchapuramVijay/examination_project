import React, { useState } from 'react';
import './ExamTable.css';

const ExamScheduleTable = () => {
    const branches = ['CSE', 'ECE', 'EEE', 'CIVIL', 'MECH'];
    const days = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];

    const [scheduleData, setScheduleData] = useState(
        branches.reduce((acc, branch) => ({
            ...acc,
            [branch]: days.reduce((dayAcc, day) => ({
                ...dayAcc,
                [`${day}_AM`]: '',
                [`${day}_PM`]: ''
            }), {})
        }), {})
    );

    const handleInputChange = (branch, timeSlot, value) => {
        if (value === '' || /^\d+$/.test(value)) {
            setScheduleData(prev => ({
                ...prev,
                [branch]: {
                    ...prev[branch],
                    [timeSlot]: value
                }
            }));
        }
    };

    const handleSubmit = () => {
        let csv = 'Branch,';
        days.forEach(day => {
            csv += `${day} AM,${day} PM,`;
        });
        csv = csv.slice(0, -1) + '\n';

        branches.forEach(branch => {
            csv += `${branch},`;
            days.forEach(day => {
                csv += `${scheduleData[branch][`${day}_AM`] || '0'},${scheduleData[branch][`${day}_PM`] || '0'},`;
            });
            csv = csv.slice(0, -1) + '\n';
        });

        const exportData = {
            scheduleData,
            csvContent: csv,
            uploadDate: new Date().toISOString()
        };

        localStorage.setItem('examSchedule', JSON.stringify(exportData));
        alert('Schedule submitted successfully!');
    };

    return (
        <div className="invigilator-schedule-wrapper">
            <div className="invigilator-table-container">
                <table className="invigilator-schedule-table">
                    <thead>
                        <tr>
                            <th className="invigilator-branch-header">Branch</th>
                            {days.map(day => (
                                <React.Fragment key={day}>
                                    <th className="invigilator-time-slot">{day} AM</th>
                                    <th className="invigilator-time-slot">{day} PM</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {branches.map(branch => (
                            <tr key={branch}>
                                <td className="invigilator-branch-cell">{branch}</td>
                                {days.map(day => (
                                    <React.Fragment key={`${branch}-${day}`}>
                                        <td className="invigilator-input-cell">
                                            <input
                                                type="text"
                                                value={scheduleData[branch][`${day}_AM`]}
                                                onChange={(e) => handleInputChange(branch, `${day}_AM`, e.target.value)}
                                                placeholder="0"
                                                className="invigilator-input"
                                            />
                                        </td>
                                        <td className="invigilator-input-cell">
                                            <input
                                                type="text"
                                                value={scheduleData[branch][`${day}_PM`]}
                                                onChange={(e) => handleInputChange(branch, `${day}_PM`, e.target.value)}
                                                placeholder="0"
                                                className="invigilator-input"
                                            />
                                        </td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleSubmit} className="invigilator-submit-btn">
                Submit Schedule
            </button>
        </div>
    );
};

export default ExamScheduleTable;