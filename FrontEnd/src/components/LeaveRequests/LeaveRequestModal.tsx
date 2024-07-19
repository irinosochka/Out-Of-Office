import React from 'react';
import { ILeaveRequest } from '../../models/ILeaveRequest';

import '../../styles/modalStyles.scss'

interface LeaveRequestModalProps {
    onClose: () => void;
    leaveRequest: ILeaveRequest;
}

const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({ onClose, leaveRequest }) => {

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Leave Request Details</h2>
                <p>ID: {leaveRequest.ID}</p>
                <p>Employee ID: {leaveRequest.EmployeeID}</p>
                <p>Absence Reason: {leaveRequest.AbsenceReason}</p>
                <p>Start Date: {new Date(leaveRequest.StartDate).toLocaleDateString()}</p>
                <p>End Date: {new Date(leaveRequest.EndDate).toLocaleDateString()}</p>
                <p>Status: {leaveRequest.Status}</p>
                <p>Comment: {leaveRequest.Comment}</p>
            </div>
        </div>
    );
};

export default LeaveRequestModal;
