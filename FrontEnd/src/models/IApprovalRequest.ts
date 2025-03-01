export interface IApprovalRequest {
    ID: number;
    Approver: number;
    LeaveRequestID: number;
    Status: 'New' | 'Approved' | 'Rejected' | 'Canceled';
    Comment?: string;
}
