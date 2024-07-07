import React, {useState} from 'react';
import './App.css';
import EmployeesPage from "./pages/EmployeesPage";
import ApprovalRequestsPage from "./pages/ApprovalRequestsPage";
import LeaveRequestsPage from "./pages/LeaveRequestsPage";
import ProjectsPage from "./pages/ProjectsPage";

function App() {
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
                {selectedButton === 'Employees' && <EmployeesPage />}
                {selectedButton === 'ApprovalRequests' && <ApprovalRequestsPage />}
                {selectedButton === 'LeaveRequest' && <LeaveRequestsPage />}
                {selectedButton === 'Project' && <ProjectsPage />}
            </div>
        </div>
    );
}

export default App;
