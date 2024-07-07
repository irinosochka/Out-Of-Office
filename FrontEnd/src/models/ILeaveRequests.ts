export interface ILeaveRequest {
    ID: number;
    Employee: number;
    AbsenceReason: string;
    StartDate: Date;
    EndDate: Date;
    Comment?: string;
    Status: 'New' | 'Submitted' | 'Approved' | 'Rejected';
}
