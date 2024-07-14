import React, { useState } from 'react';
import './App.css';
import EmployeesPage from './pages/EmployeesPage';
import ApprovalRequestsPage from './pages/ApprovalRequestsPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import ProjectsPage from './pages/ProjectsPage';
import ListButton from "./common/ListButton";
import RoleSelection from "./common/RoleSelection";

function App() {
    const [selectedButton, setSelectedButton] = useState<string>('Employees');
    const [selectedRole, setSelectedRole] = useState<string>('Employee');

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
    };

    return (
        <div>
            <div>
                <h1>Role Selection</h1>
                <RoleSelection onRoleSelect={handleRoleSelect} />
                <p>Selected Role: {selectedRole}</p>
            </div>
            <ListButton
                selectedButton={selectedButton}
                setSelectedButton={setSelectedButton}
            />
            <div>
                {selectedButton === 'Employees' && <EmployeesPage />}
                {selectedButton === 'ApprovalRequests' && <ApprovalRequestsPage />}
                {selectedButton === 'LeaveRequest' && <LeaveRequestsPage />}
                {selectedButton === 'Project' && <ProjectsPage />}
            </div>
        </div>
    );
}

export default App;
