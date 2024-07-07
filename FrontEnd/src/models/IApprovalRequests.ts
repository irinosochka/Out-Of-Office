export interface IApprovalRequest {
    ID: number;
    Approver: number;
    LeaveRequest: number;
    Status: 'New' | 'Approved' | 'Rejected';
    Comment?: string;
}
