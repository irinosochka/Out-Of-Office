import React, { useState, useEffect } from 'react';
import EmployeesPage from "./EmployeesPage";
import ApprovalRequestsPage from "./ApprovalRequestsPage";
import LeaveRequestsPage from "./LeaveRequestsPage";
import ProjectsPage from "./ProjectsPage";
import ListButton from "../common/ListButton";
import RoleSelection from "../common/RoleSelection";
import { useRole } from "../context/RoleContext";

import '../styles/pageStyles.scss';

const MainPage: React.FC = () => {
    const { selectedRole, setSelectedRole } = useRole();
    const [selectedButton, setSelectedButton] = useState<string>('');

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
    };

    useEffect(() => {
        if (selectedRole === 'Employee') {
            setSelectedButton('LeaveRequest');
        } else if (selectedRole === '') {
            setSelectedButton('');
        } else if (selectedRole === 'Project Manager') {
            setSelectedButton('Project');
        } else {
            setSelectedButton('Employees');
        }
    }, [selectedRole]);

    return (
        <div className="page-container">
            <div className="role-selection-container">
                <RoleSelection onRoleSelect={handleRoleSelect} />
            </div>
            {selectedRole && selectedRole !== 'Employee' && (
                <div className="button-list-container">
                    <ListButton
                        selectedButton={selectedButton}
                        setSelectedButton={setSelectedButton}
                    />
                </div>
            )}
            <div className="content-container">
                {selectedRole === '' && <p className="no-role-message">Please choose a role to continue.</p>}
                {selectedButton === 'Employees' && selectedRole !== 'Employee' && <EmployeesPage />}
                {selectedButton === 'ApprovalRequests' && selectedRole !== 'Employee' && <ApprovalRequestsPage />}
                {selectedButton === 'LeaveRequest' && selectedRole !== '' && <LeaveRequestsPage />}
                {selectedButton === 'Project' && selectedRole !== 'Employee' && <ProjectsPage />}
            </div>
        </div>
    );
}

export default MainPage;
