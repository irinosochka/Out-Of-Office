import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {ILeaveRequest} from "../models/ILeaveRequests";
import LeaveRequestsTable from "../components/LeaveRequestsTable";

const LeaveRequestsPage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get<ILeaveRequest[]>('http://localhost:8082/Lists/LeaveRequests');
                console.log(response.data); // Check the structure and contents
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <div>
            <h2>Leave Requests Table</h2>
            <LeaveRequestsTable leaveRequests={leaveRequests} />
        </div>
    );
};

export default LeaveRequestsPage;
