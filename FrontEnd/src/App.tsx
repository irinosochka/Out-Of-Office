// App.tsx
import React, { useState } from 'react';
import './App.css';
import EmployeesPage from './pages/EmployeesPage';
import ApprovalRequestsPage from './pages/ApprovalRequestsPage';
import LeaveRequestsPage from './pages/LeaveRequestsPage';
import ProjectsPage from './pages/ProjectsPage';
import ListButton from "./common/ListButton";

function App() {
    const [selectedButton, setSelectedButton] = useState<string>('Employees');

    return (
        <div>
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
