import React, { useState } from 'react';
import { IEmployee } from '../models/IEmployee';

interface EmployeeTableProps {
    employees: IEmployee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
    const [sortBy, setSortBy] = useState<keyof IEmployee>('EmployeeID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

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

    const sortedEmployees = [...employees].sort((a, b) => {
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


    return (
        <div>
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
                    <tr key={idx}>
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

export default EmployeeTable;
