import React from 'react';

import '../styles/pageStyles.scss'

interface ListButtonProps {
    selectedButton: string;
    setSelectedButton: (button: string) => void;
}

const ListButton: React.FC<ListButtonProps> = ({ selectedButton, setSelectedButton }) => {
    return (
        <div className="button-list">
            <button
                onClick={() => setSelectedButton('Employees')}
                className={`list-button ${selectedButton === 'Employees' ? 'active' : ''}`}
            >
                Employees
            </button>
            <button
                onClick={() => setSelectedButton('ApprovalRequests')}
                className={`list-button ${selectedButton === 'ApprovalRequests' ? 'active' : ''}`}
            >
                Approval Requests
            </button>
            <button
                onClick={() => setSelectedButton('LeaveRequest')}
                className={`list-button ${selectedButton === 'LeaveRequest' ? 'active' : ''}`}
            >
                Leave Request
            </button>
            <button
                onClick={() => setSelectedButton('Project')}
                className={`list-button ${selectedButton === 'Project' ? 'active' : ''}`}
            >
                Project
            </button>
        </div>
    );
};

export default ListButton;
