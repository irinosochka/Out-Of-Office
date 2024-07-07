// ListButton.tsx
import React from 'react';

interface ListButtonProps {
    selectedButton: string;
    setSelectedButton: (button: string) => void;
}

const ListButton: React.FC<ListButtonProps> = ({ selectedButton, setSelectedButton }) => {
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
        </div>
    );
};

export default ListButton;
