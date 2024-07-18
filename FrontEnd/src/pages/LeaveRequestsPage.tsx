import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {ILeaveRequest} from "../models/ILeaveRequest";
import LeaveRequestsTable from "../components/LeaveRequests/LeaveRequestsTable";
import Modal from "../common/Modal";
import AddLeaveRequestForm from "../components/LeaveRequests/AddLeaveRequestForm";

const LeaveRequestsPage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleAddLeaveRequests = (leaveRequest: ILeaveRequest) => {
        setLeaveRequests([...leaveRequests, leaveRequest]);
    };

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
            <button onClick={() => setIsModalOpen(true)}>Add Leave Request</button>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddLeaveRequestForm
                    onSubmit={handleAddLeaveRequests}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
            <LeaveRequestsTable leaveRequests={leaveRequests} />
        </div>
    );
};

export default LeaveRequestsPage;
