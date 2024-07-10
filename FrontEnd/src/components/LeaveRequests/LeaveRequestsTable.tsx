import React, { useState } from 'react';
import {ILeaveRequest} from "../../models/ILeaveRequests";

interface LeaveRequestsTableProps {
    leaveRequests: ILeaveRequest[];
}

const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({ leaveRequests }) => {
    const [sortBy, setSortBy] = useState<keyof ILeaveRequest>('ID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const handleSort = (column: keyof ILeaveRequest) => {
        if (sortBy === column) {
            // If clicking on the same column, reverse the sort order
            setSortAsc(!sortAsc);
        } else {
            // If clicking on a different column, set the new column for sorting
            setSortBy(column);
            setSortAsc(true); // Default to ascending order for the new column
        }
    };


    const sorted = [...leaveRequests].sort((a, b) => {
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
                    <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                    <SortableHeader column="Employee" title="Employee" handleSort={handleSort} />
                    <SortableHeader column="AbsenceReason" title="AbsenceReason" handleSort={handleSort} />
                    <SortableHeader column="StartDate" title="StartDate" handleSort={handleSort} />
                    <SortableHeader column="EndDate" title="EndDate" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                </tr>
                </thead>
                <tbody>
                {sorted.map((leaveRequests, idx) => (
                    <tr key={idx}>
                        <td>{leaveRequests.ID}</td>
                        <td>{leaveRequests.Employee}</td>
                        <td>{leaveRequests.AbsenceReason}</td>
                        <td>{leaveRequests.StartDate.toLocaleDateString()}</td>
                        <td>{leaveRequests.EndDate.toLocaleDateString()}</td>
                        <td>{leaveRequests.Status}</td>
                        <td>{leaveRequests.Comment}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

interface SortableHeaderProps {
    column: keyof ILeaveRequest;
    title: string;
    handleSort: (column: keyof ILeaveRequest) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, title, handleSort }) => {
    return (
        <th onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
            {title}
        </th>
    );
};

export default LeaveRequestsTable;
