import React, { useEffect, useState } from 'react';
import { IApprovalRequest } from "../models/IApprovalRequest";
import ApprovalRequestsTable from "../components/ApprovalRequests/ApprovalRequestsTable";
import { getApprovalRequests, updateApprovalRequest } from "../api/ApprovalRequestApi";
import AddCommentModal from "../components/ApprovalRequests/AddCommentModal";
import { getLeaveRequestById, updateLeaveRequest } from "../api/LeaveRequestApi";
import moment from "moment";
import { getEmployeeById, updateEmployee } from "../api/EmployeeApi";

const ApprovalRequestsPage: React.FC = () => {
    const [approvalRequests, setApprovalRequests] = useState<IApprovalRequest[]>([]);
    const [showAddingCommentForm, setShowAddingCommentForm] = useState<boolean>(false);
    const [requestForAddComment, setRequestForAddComment] = useState<IApprovalRequest | null>(null);

    useEffect(() => {
        const fetchApprovalRequests = async () => {
            try {
                const response = await getApprovalRequests();
                setApprovalRequests(response.data);
            } catch (error) {
                console.error('Error fetching approval requests:', error);
            }
        };

        fetchApprovalRequests();
    }, []);

    const handleApproval = async (request: IApprovalRequest, status: 'Approved' | 'Rejected') => {
        try {
            const leaveResponse = await getLeaveRequestById(request.LeaveRequestID);
            const leaveRequest = leaveResponse.data;

            const dayOff = moment(leaveRequest.EndDate).diff(moment(leaveRequest.StartDate), 'days') + 1;

            const employeeResponse = await getEmployeeById(leaveRequest.EmployeeID);
            const employee = employeeResponse.data;

            if (employee.OutOfOfficeBalance >= dayOff) {
                const updatedEmployee = {
                    ...employee,
                    OutOfOfficeBalance: employee.OutOfOfficeBalance - dayOff
                };

                await updateEmployee(updatedEmployee);

                const updatedLeaveRequest = {
                    ...leaveRequest,
                    StartDate: moment(leaveRequest.StartDate).format('YYYY-MM-DD'),
                    EndDate: moment(leaveRequest.EndDate).format('YYYY-MM-DD'),
                    Status: status,
                };

                await updateLeaveRequest(updatedLeaveRequest);
                await updateApprovalRequest({ ...request, Status: 'Approved' });

                setApprovalRequests((prevRequests) =>
                    prevRequests.map((req) => (req.ID === request.ID ? { ...req, Status: 'Approved' } : req))
                );
            } else {
                alert('Employee does not have enough leave days.');
            }
        } catch (error) {
            console.error('Error handling approval:', error);
        }
    };

    const handleRejection = async (request: IApprovalRequest, comment: string, status: 'Approved' | 'Rejected') => {
        try {
            const leaveResponse = await getLeaveRequestById(request.LeaveRequestID);
            const leaveRequest = leaveResponse.data;

            const updatedLeaveRequest = {
                ...leaveRequest,
                StartDate: moment(leaveRequest.StartDate).format('YYYY-MM-DD'),
                EndDate: moment(leaveRequest.EndDate).format('YYYY-MM-DD'),
                Status: status,
                Comment: comment,
            };

            await updateLeaveRequest(updatedLeaveRequest);
            await updateApprovalRequest({ ...request, Status: 'Rejected', Comment: comment });

            setApprovalRequests((prevRequests) =>
                prevRequests.map((req) => (req.ID === request.ID ? { ...req, Status: 'Rejected', Comment: comment } : req))
            );
        } catch (error) {
            console.error('Error handling rejection:', error);
        }
    };

    const handleStatusChange = (request: IApprovalRequest, status: 'Approved' | 'Rejected') => {
        if (status === 'Approved') {
            handleApproval(request, 'Approved');
        } else {
            setRequestForAddComment(request);
            setShowAddingCommentForm(true);
        }
    };

    const handleAddCommentSubmit = async (comment: string) => {
        if (requestForAddComment) {
            await handleRejection(requestForAddComment, comment, 'Rejected' );
            setRequestForAddComment(null);
            setShowAddingCommentForm(false);
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
                    onClose={() => setShowAddingCommentForm(false)}
                    onSubmit={handleAddCommentSubmit}
                />
            )}
        </>
    );
};

export default ApprovalRequestsPage;
