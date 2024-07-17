import React, { useState } from 'react';
import { IEmployee } from "../../models/IEmployee";
import Search from "../../common/Search";
import EmployeeModal from "./EmployeeModal";
import { useRole } from "../../context/RoleContext";
import axios from "axios";
import UpdateEmployeeForm from './UpdateEmployeeForm';
import {ILeaveRequest} from "../../models/ILeaveRequests";

interface EmployeeTableProps {
    employees: IEmployee[];
    setEmployees: React.Dispatch<React.SetStateAction<IEmployee[]>>;
}

const EmployeesTable: React.FC<EmployeeTableProps> = ({ employees, setEmployees }) => {
    const [sortBy, setSortBy] = useState<keyof IEmployee>('ID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
    const { selectedRole } = useRole();

    const handleSort = (column: keyof IEmployee) => {
        if (sortBy === column) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(column);
            setSortAsc(true);
        }
    };

    const filteredEmployees = searchTerm ? employees.filter(employee =>
        employee.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : employees;

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortAsc ? aValue - bValue : bValue - aValue;
        } else {
            return 0;
        }
    });

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    const handleEditEmployee = (employee: IEmployee) => {
        setEditingEmployee(employee);
    };





    const handleUpdateEmployee = async (updatedEmployee: IEmployee) => {
        try {
            const response = await axios.put(`http://localhost:8082/Lists/Employees/${updatedEmployee.ID}`, updatedEmployee);
            if (response.status === 200) {
                setEmployees((prevEmployees) =>
                    prevEmployees.map((emp) => (emp.ID === updatedEmployee.ID ? updatedEmployee : emp))
                );
                console.log("Employee updated:", response.data);
            } else {
                console.error("Failed to update employee, status:", response.status);
            }
        } catch (error) {
            console.error("Failed to update employee:", error);
        }
        setEditingEmployee(null);
    };

    const handleDeactivateEmployee = async (deletedEmployee: IEmployee) => {
        try {
            // Check if the employee is referenced in the projects or employees table
            const checkReferencesResponse = await axios.get<{ referenced: boolean }>(
                `http://localhost:8082/Lists/Employees/${deletedEmployee.ID}/checkReferences`
            );

            if (checkReferencesResponse.data.referenced) {
                alert('Cannot delete employee, they are referenced in projects or as a people partner.');
                return;
            }

            // Check if the employee has leave requests
            const leaveRequestsResponse = await axios.get<ILeaveRequest[]>(
                `http://localhost:8082/Lists/Employees/${deletedEmployee.ID}/leaveRequests`
            );

            if (leaveRequestsResponse.data.length > 0) {
                // Delete all leave requests for the employee
                for (const leaveRequest of leaveRequestsResponse.data) {
                    // First delete approval requests associated with this leave request
                    await axios.delete(`http://localhost:8082/Lists/ApprovalRequests/${leaveRequest.ID}`);
                    // Then delete the leave request
                    await axios.delete(`http://localhost:8082/Lists/LeaveRequests/${leaveRequest.ID}`);
                }
            }

            // Delete employee
            const deleteResponse = await axios.delete(`http://localhost:8082/Lists/Employees/${deletedEmployee.ID}`);
            if (deleteResponse.status === 200) {
                setEmployees((prevEmployees) =>
                    prevEmployees.filter((emp) => emp.ID !== deletedEmployee.ID)
                );
                console.log("Employee deleted:", deletedEmployee);
            } else {
                console.error("Failed to delete employee, status:", deleteResponse.status);
            }
        } catch (error) {
            console.error("Failed to delete employee:", error);
        }
    };



    return (
        <div>
            <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name..." />
            <table>
                <thead>
                <tr>
                    <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                    <SortableHeader column="Photo" title="Photo" handleSort={handleSort} />
                    <SortableHeader column="FullName" title="Full Name" handleSort={handleSort} />
                    <SortableHeader column="Subdivision" title="Subdivision" handleSort={handleSort} />
                    <SortableHeader column="Position" title="Position" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="PeoplePartner" title="People Partner" handleSort={handleSort} />
                    <SortableHeader column="OutOfOfficeBalance" title="Out Of Office Balance" handleSort={handleSort} />
                    {selectedRole === "HR Manager" && <th>Actions</th>}
                </tr>
                </thead>
                <tbody>
                {sortedEmployees.map((employee, idx) => (
                    <tr key={idx} onClick={() => setSelectedEmployee(employee)} style={{ cursor: 'pointer' }}>
                        <td>{employee.ID}</td>
                        <td>{employee.Photo}</td>
                        <td>{employee.FullName}</td>
                        <td>{employee.Subdivision}</td>
                        <td>{employee.Position}</td>
                        <td>{employee.Status}</td>
                        <td>{employee.PeoplePartner}</td>
                        <td>{employee.OutOfOfficeBalance}</td>
                        {selectedRole === "HR Manager" && (
                            <td>
                                <button onClick={(e) => { e.stopPropagation(); handleEditEmployee(employee); }}>Edit</button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeactivateEmployee(employee); }}>Deactivate</button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedEmployee && (
                <EmployeeModal employee={selectedEmployee} onClose={handleCloseModal} />
            )}
            {editingEmployee && (
                <UpdateEmployeeForm
                    employee={editingEmployee}
                    onSubmit={handleUpdateEmployee}
                    onClose={() => setEditingEmployee(null)}
                />
            )}
        </div>
    );
};

interface SortableHeaderProps {
    column: keyof IEmployee;
    title: string;
    handleSort: (column: keyof IEmployee) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, title, handleSort }) => {
    return (
        <th onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
            {title}
        </th>
    );
};

export default EmployeesTable;
