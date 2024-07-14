import React from 'react';
import Modal from '../../common/Modal';
import { ILeaveRequest } from '../../models/ILeaveRequests';

interface LeaveRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    leaveRequest: ILeaveRequest | null;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ isOpen, onClose, leaveRequest }) => {
    if (!isOpen || !leaveRequest) {
        return null;
    }

    return (
        <Modal show={isOpen} onClose={onClose}>
            <h2>Leave Request Details</h2>
            <p>ID: {leaveRequest.ID}</p>
            <p>Employee ID: {leaveRequest.EmployeeID}</p>
            <p>Absence Reason: {leaveRequest.AbsenceReason}</p>
            <p>Start Date: {new Date(leaveRequest.StartDate).toLocaleDateString()}</p>
            <p>End Date: {new Date(leaveRequest.EndDate).toLocaleDateString()}</p>
            <p>Status: {leaveRequest.Status}</p>
            <p>Comment: {leaveRequest.Comment}</p>
        </Modal>
    );
};

export default LeaveRequestModal;
