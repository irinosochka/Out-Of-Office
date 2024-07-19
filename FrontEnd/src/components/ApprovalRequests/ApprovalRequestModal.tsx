import React from 'react';
import {IApprovalRequest} from "../../models/IApprovalRequest";

import '../../styles/modalStyles.scss'


interface ApprovalRequestModalProps {
    onClose: () => void;
    approvalRequest: IApprovalRequest;
}

const ApprovalRequestModal: React.FC<ApprovalRequestModalProps> = ({ onClose, approvalRequest }) => {

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Approval Request Details</h2>
                <p>ID: {approvalRequest.ID}</p>
                <p>Approver: {approvalRequest.Approver}</p>
                <p>Leave Request ID: {approvalRequest.LeaveRequestID}</p>
                <p>Status: {approvalRequest.Status}</p>
                <p>Comment: {approvalRequest.Comment}</p>
            </div>
        </div>
    );
};

export default ApprovalRequestModal;
