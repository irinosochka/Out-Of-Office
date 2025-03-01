export interface IEmployee {
    ID: number;
    FullName: string;
    Subdivision: string;
    Position: string;
    Status: 'Active' | 'Inactive';
    PeoplePartner: number;
    OutOfOfficeBalance: number;
    Photo?: string;
}
