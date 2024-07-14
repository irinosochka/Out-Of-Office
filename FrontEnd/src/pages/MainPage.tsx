import React, { useState, useEffect } from 'react';
import EmployeesPage from "./EmployeesPage";
import ApprovalRequestsPage from "./ApprovalRequestsPage";
import LeaveRequestsPage from "./LeaveRequestsPage";
import ProjectsPage from "./ProjectsPage";
import ListButton from "../common/ListButton";
import RoleSelection from "../common/RoleSelection";
import { useRole } from "../context/RoleContext";

const MainPage: React.FC = () => {
    const { selectedRole, setSelectedRole } = useRole();
    const [selectedButton, setSelectedButton] = useState<string>('');

    const handleRoleSelect = (role: string) => {
        setSelectedRole(role);
    };

    useEffect(() => {
        if (selectedRole === 'Employee') {
            setSelectedButton('LeaveRequest');
        } else if(selectedRole === ''){
            setSelectedButton('');
        } else {
            setSelectedButton('Employees');
        }
    }, [selectedRole]);

    return (
        <div>
            <div>
                <h1>Role Selection</h1>
                <RoleSelection onRoleSelect={handleRoleSelect} />
                <p>Selected Role: {selectedRole}</p>
            </div>
            {selectedRole && selectedRole !== 'Employee' && (
                <ListButton
                    selectedButton={selectedButton}
                    setSelectedButton={setSelectedButton}
                />
            )}
            <div>
                {selectedRole === '' && <p>Please choose a role to continue.</p>}
                {selectedButton === 'Employees' && selectedRole !== 'Employee' && <EmployeesPage />}
                {selectedButton === 'ApprovalRequests' && selectedRole !== 'Employee' && <ApprovalRequestsPage />}
                {selectedButton === 'LeaveRequest' && selectedRole === 'Employee' && <LeaveRequestsPage />}
                {selectedButton === 'Project' && selectedRole !== 'Employee' && <ProjectsPage />}
            </div>
        </div>
    );
}

export default MainPage;
