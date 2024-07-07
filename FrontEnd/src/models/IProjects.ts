export interface IProject {
    ID: number;
    ProjectType: string;
    StartDate: Date;
    EndDate?: Date;
    ProjectManager: number;
    Comment?: string;
    Status: 'Active' | 'Inactive';
}
