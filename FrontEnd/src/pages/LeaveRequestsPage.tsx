import React, { useEffect, useState } from 'react';
import {ILeaveRequest} from "../models/ILeaveRequest";
import LeaveRequestsTable from "../components/LeaveRequests/LeaveRequestsTable";
import Modal from "../common/Modal";
import AddLeaveRequestForm from "../components/LeaveRequests/AddLeaveRequestForm";
import LeaveRequestModal from "../components/LeaveRequests/LeaveRequestModal";
import {useRole} from "../context/RoleContext";
import moment from "moment";
import {deleteLeaveRequest, getLeaveRequests, updateLeaveRequest} from "../api/LeaveRequestApi";

const LeaveRequestsPage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingLeaveRequest, setEditingLeaveRequest] = useState<ILeaveRequest | null>(null);
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ILeaveRequest | null>(null);

    const {selectedRole} = useRole();

    const isEmp = () => selectedRole === 'Employee';

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getLeaveRequests();
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleCloseModal = () => {
        setSelectedLeaveRequest(null);
    };

    const handleAddLeaveRequest = (request: ILeaveRequest) => {
        setLeaveRequests([...leaveRequests, request]);
    };


    const handleDeleteLeaveRequest = async (deletedRequest: ILeaveRequest) => {
        try {
            const deleteResponse = await deleteLeaveRequest(deletedRequest.ID);
            if (deleteResponse.status === 200) {
                setLeaveRequests((prevRequests) =>
                    prevRequests.filter((req) => req.ID !== deletedRequest.ID)
                );
            } else {
                console.error("Failed to delete leave request, status:", deleteResponse.status);
            }
        } catch (error) {
            console.error("Failed to delete leave request:", error);
        }
    };

    const handleEditLeaveRequest = (request: ILeaveRequest) => {
        setEditingLeaveRequest(request);
    };

    const handleUpdateLeaveRequest = async (updatedRequest: ILeaveRequest) => {
        const formattedRequest = {
            ...updatedRequest,
            StartDate: moment(updatedRequest.StartDate).format('YYYY-MM-DD'),
            EndDate: moment(updatedRequest.EndDate).format('YYYY-MM-DD'),
        };

        try {
            const response = await updateLeaveRequest(formattedRequest);
            if (response.status === 200) {
                setLeaveRequests((prevRequests) =>
                    prevRequests.map((req) => (req.ID === updatedRequest.ID ? updatedRequest : req))
                );
            } else {
                console.error("Failed to update leave request, status:", response.status);
            }
        } catch (error) {
            console.error("Failed to update leave request:", error);
        }
        setEditingLeaveRequest(null);
    };


    const handleStatusChange = async (request: ILeaveRequest, updatedStatus : 'Submitted' | 'Canceled') => {
        const updatedProject: ILeaveRequest = { ...request, Status: updatedStatus };
        await handleUpdateLeaveRequest(updatedProject);
    };

    return (
        <>
            <LeaveRequestsTable
                leaveRequests={leaveRequests}
                isEmp={isEmp()}
                setIsModalOpen={setIsModalOpen}
                setSelectedRequest={setSelectedLeaveRequest}
                handleEditRequest={handleEditLeaveRequest}
                handleStatusChange={handleStatusChange}
                handleDeleteRequest={handleDeleteLeaveRequest}
            />
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddLeaveRequestForm
                    onSubmit={handleAddLeaveRequest}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
            <LeaveRequestModal
                isOpen={selectedLeaveRequest !== null}
                onClose={() => handleCloseModal()}
                leaveRequest={selectedLeaveRequest}
            />
        </>
    );
};

export default LeaveRequestsPage;
