import React, { useState } from 'react';

const ListButton: React.FC = () => {
    const [selectedButton, setSelectedButton] = useState<string>('Employees');

    return (
        <div>
            <button
                onClick={() => setSelectedButton('Employees')}
                className={selectedButton === 'Employees' ? 'active' : ''}
            >
                Employees
            </button>
            <button
                onClick={() => setSelectedButton('ApprovalRequests')}
                className={selectedButton === 'ApprovalRequests' ? 'active' : ''}
            >
                Approval Requests
            </button>
            <button
                onClick={() => setSelectedButton('LeaveRequest')}
                className={selectedButton === 'LeaveRequest' ? 'active' : ''}
            >
                Leave Request
            </button>
            <button
                onClick={() => setSelectedButton('Project')}
                className={selectedButton === 'Project' ? 'active' : ''}
            >
                Project
            </button>

            <div>
                {selectedButton === 'Employees' && <p>Employees content</p>}
                {selectedButton === 'ApprovalRequests' && <p>Approval Requests content</p>}
                {selectedButton === 'LeaveRequest' && <p>Leave Request content</p>}
                {selectedButton === 'Project' && <p>Project content</p>}
            </div>
        </div>
    );
};

export default ListButton;
