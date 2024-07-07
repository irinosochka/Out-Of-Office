export interface IEmployee {
    EmployeeID: number;
    FullName: string;
    Subdivision: string;
    Position: string;
    Status: 'Active' | 'Inactive';
    PeoplePartner: number;
    OutOfOfficeBalance: number;
    Photo?: string;
}
