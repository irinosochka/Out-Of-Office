CREATE DATABASE out_of_office;

USE out_of_office;

CREATE TABLE Employees (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Subdivision VARCHAR(255) NOT NULL,
    Position VARCHAR(255) NOT NULL,
    Status ENUM('Active', 'Inactive') NOT NULL,
    PeoplePartner INT,
    OutOfOfficeBalance INT NOT NULL,
    Photo BLOB,
    FOREIGN KEY (PeoplePartner) REFERENCES Employees(ID)
);

CREATE TABLE LeaveRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    EmployeeID INT NOT NULL,
    AbsenceReason VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Comment TEXT,
    Status ENUM('New', 'Submitted', 'Approved', 'Rejected', 'Canceled') NOT NULL,
    FOREIGN KEY (EmployeeID) REFERENCES Employees(ID)
);

CREATE TABLE ApprovalRequests (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Approver INT,
    LeaveRequestID INT,
    Status ENUM('New', 'Approved', 'Rejected', 'Canceled') NOT NULL,
    Comment TEXT,
    FOREIGN KEY (Approver) REFERENCES Employees(ID),
    FOREIGN KEY (LeaveRequestID) REFERENCES LeaveRequests(ID)
);

CREATE TABLE Projects (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ProjectType VARCHAR(255) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    ProjectManager INT,
    Comment TEXT,
    Status ENUM('Active', 'Inactive') NOT NULL,
    FOREIGN KEY (ProjectManager) REFERENCES Employees(ID)
);
