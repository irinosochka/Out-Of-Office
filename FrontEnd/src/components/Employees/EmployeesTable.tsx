import React, { useState } from 'react';
import {IEmployee} from "../../models/IEmployee";
import Search from "../../common/Search";
import EmployeeModal from "./EmployeeModal";

interface EmployeeTableProps {
    employees: IEmployee[];
}

const EmployeesTable: React.FC<EmployeeTableProps> = ({ employees }) => {
    const [sortBy, setSortBy] = useState<keyof IEmployee>('EmployeeID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);

    const handleSort = (column: keyof IEmployee) => {
        if (sortBy === column) {
            // If clicking on the same column, reverse the sort order
            setSortAsc(!sortAsc);
        } else {
            // If clicking on a different column, set the new column for sorting
            setSortBy(column);
            setSortAsc(true); // Default to ascending order for the new column
        }
    };

    // Function to filter employees based on search term
    const filteredEmployees = searchTerm ? employees.filter(employee =>
        employee.FullName.toLowerCase().includes(searchTerm.toLowerCase())
    ) : employees;

    const sortedEmployees = [...filteredEmployees].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            if (sortAsc) {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (sortAsc) {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        } else {
            return 0; // if aValue or bValue is undefined
        }
    });

    const handleRowClick = (employee: IEmployee) => {
        setSelectedEmployee(employee);
    };

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };


    return (
        <div>
            <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name..."
            />
            <table>
                <thead>
                <tr>
                    <SortableHeader column="EmployeeID" title="ID" handleSort={handleSort} />
                    <SortableHeader column="Photo" title="Photo" handleSort={handleSort} />
                    <SortableHeader column="FullName" title="Full Name" handleSort={handleSort} />
                    <SortableHeader column="Subdivision" title="Subdivision" handleSort={handleSort} />
                    <SortableHeader column="Position" title="Position" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="PeoplePartner" title="People Partner" handleSort={handleSort} />
                    <SortableHeader column="OutOfOfficeBalance" title="Out Of Office Balance" handleSort={handleSort} />
                </tr>
                </thead>
                <tbody>
                {sortedEmployees.map((employee, idx) => (
                    <tr key={idx} onClick={() => handleRowClick(employee)} style={{ cursor: 'pointer' }}>
                        <td>{employee.EmployeeID}</td>
                        <td>{employee.Photo}</td>
                        <td>{employee.FullName}</td>
                        <td>{employee.Subdivision}</td>
                        <td>{employee.Position}</td>
                        <td>{employee.Status}</td>
                        <td>{employee.PeoplePartner}</td>
                        <td>{employee.OutOfOfficeBalance}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            {selectedEmployee && (
                <EmployeeModal employee={selectedEmployee} onClose={handleCloseModal} />
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
