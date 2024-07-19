import React, { useEffect, useState } from 'react';
import {ILeaveRequest} from "../models/ILeaveRequest";
import LeaveRequestsTable from "../components/LeaveRequests/LeaveRequestsTable";
import AddLeaveRequestForm from "../components/LeaveRequests/AddLeaveRequestForm";
import LeaveRequestModal from "../components/LeaveRequests/LeaveRequestModal";
import {useRole} from "../context/RoleContext";
import moment from "moment";
import {deleteLeaveRequest, getLeaveRequests, updateLeaveRequest} from "../api/LeaveRequestApi";
import UpdateLeaveRequestForm from "../components/LeaveRequests/UpdateLeaveRequestForm";

const LeaveRequestsPage: React.FC = () => {
    const [leaveRequests, setLeaveRequests] = useState<ILeaveRequest[]>([]);
    const [showAddingForm, setShowAddingForm] = useState<boolean>(false);
    const [editingLeaveRequest, setEditingLeaveRequest] = useState<ILeaveRequest | null>(null);
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ILeaveRequest | null>(null);

    const {selectedRole} = useRole();

    const isEmp = () => selectedRole === 'Employee';

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await getLeaveRequests();
                setLeaveRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchLeaveRequests();
    }, []);

    const handleCloseAdding = () => {
        setShowAddingForm(false);
    };

    const handleAddLeaveRequest = (request: ILeaveRequest) => {
        setLeaveRequests([...leaveRequests, request]);
    };

    const handleDeleteLeaveRequest = async (deletedRequest: ILeaveRequest) => {
        if(deletedRequest.Status != 'Approved') {
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
        }else {
            alert('You cannot delete approved request.')
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
                    prevRequests.map((req) => (req.ID === updatedRequest.ID ? response.data : req))
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
                setShowAddingForm={setShowAddingForm}
                setSelectedRequest={setSelectedLeaveRequest}
                handleEditRequest={handleEditLeaveRequest}
                handleStatusChange={handleStatusChange}
                handleDeleteRequest={handleDeleteLeaveRequest}
            />
            {showAddingForm && (
                <AddLeaveRequestForm
                    onSubmit={handleAddLeaveRequest}
                    onClose={() => handleCloseAdding()}
                />
            )}
            {selectedLeaveRequest && (
                <LeaveRequestModal
                    onClose={() => setSelectedLeaveRequest(null)}
                    leaveRequest={selectedLeaveRequest}
                />
            )}
            {editingLeaveRequest && (
                <UpdateLeaveRequestForm
                    leaveRequest={editingLeaveRequest}
                    onSubmit={handleUpdateLeaveRequest}
                    onClose={() => setEditingLeaveRequest(null)}
                />
            )}
        </>
    );
};

export default LeaveRequestsPage;
