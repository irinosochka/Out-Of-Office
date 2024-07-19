import React, { useEffect, useState } from 'react';
import {IApprovalRequest} from "../models/IApprovalRequest";
import ApprovalRequestsTable from "../components/ApprovalRequests/ApprovalRequestsTable";
import {getApprovalRequests, updateApprovalRequest} from "../api/ApprovalRequestApi";
import AddCommentModal from "../components/ApprovalRequests/AddCommentModal";
import {getLeaveRequestById, updateLeaveRequest} from "../api/LeaveRequestApi";
import moment from "moment";

const ApprovalRequestsPage: React.FC = () => {
    const [approvalRequests, setApprovalRequests] = useState<IApprovalRequest[]>([]);
    const [showAddingCommentForm, setShowAddingCommentForm] = useState<boolean>(false);
    const [requestForAddComment, setRequestForAddComment] = useState<IApprovalRequest>();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getApprovalRequests();
                setApprovalRequests(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);

    const handleUpdateApprovalRequest = async (updatedRequest: IApprovalRequest) => {
        try {
            const response = await updateApprovalRequest(updatedRequest);
            if (response.status === 200) {
                setApprovalRequests((prevRequests) =>
                    prevRequests.map((req) => (req.ID === updatedRequest.ID ? response.data : req))
                );
            } else {
                console.error("Failed to update approval request, status:", response.status);
            }
        } catch (error) {
            console.error("Failed to update approval request:", error);
        }
    };

    const handleUpdateLeaveRequest = async (updatedRequest: IApprovalRequest, updatedStatus : 'Approved' | 'Rejected' ) => {
        const responseID = await getLeaveRequestById(updatedRequest.LeaveRequestID);
        const leaveRequest = responseID.data;

        const updatedLeaveRequest = {
            ...leaveRequest,
            StartDate: moment(leaveRequest.StartDate).format('YYYY-MM-DD'),
            EndDate: moment(leaveRequest.EndDate).format('YYYY-MM-DD'),
            Status: updatedStatus};

        try {
            const response = await updateLeaveRequest(updatedLeaveRequest);
            if (response.status === 200) {
                setApprovalRequests((prevRequests) =>
                    prevRequests.map((req) => (req.ID === updatedRequest.ID ? response.data : req))
                );
            } else {
                console.error("Failed to update approval request, status:", response.status);
            }
        } catch (error) {
            console.error("Failed to update approval request:", error);
        }
    };

    const handleStatusChange = async (request: IApprovalRequest, updatedStatus : 'Approved' | 'Rejected') => {
        if(updatedStatus === 'Approved'){
            const updatedProject: IApprovalRequest = { ...request, Status: updatedStatus };
            await handleUpdateApprovalRequest(updatedProject);
            await handleUpdateLeaveRequest(updatedProject, updatedStatus);
        } else {
            setRequestForAddComment(request);
            setShowAddingCommentForm(true);
        }
    };


    return (
        <>
            <ApprovalRequestsTable
                approvalRequests={approvalRequests}
                handleStatusChange={handleStatusChange}
            />
            {showAddingCommentForm && requestForAddComment && (
                <AddCommentModal
                    approvalRequest={requestForAddComment}
                    onClose={() => setShowAddingCommentForm(false)}
                    handleUpdateApprovalRequest={handleUpdateApprovalRequest}
                />
            )}
        </>
    );
};

export default ApprovalRequestsPage;
