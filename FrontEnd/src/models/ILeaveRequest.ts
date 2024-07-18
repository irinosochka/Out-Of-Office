export interface ILeaveRequest {
    ID: number;
    EmployeeID: number;
    AbsenceReason: string;
    StartDate: Date;
    EndDate: Date;
    Comment?: string;
    Status: 'New' | 'Submitted' | 'Approved' | 'Rejected';
}
