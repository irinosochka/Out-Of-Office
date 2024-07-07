import React, { useState } from 'react';
import {IApprovalRequest} from "../models/IApprovalRequests";

interface LeaveRequestsTableProps {
    approvalRequests: IApprovalRequest[];
}

const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({ approvalRequests }) => {
    const [sortBy, setSortBy] = useState<keyof IApprovalRequest>('ID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const handleSort = (column: keyof IApprovalRequest) => {
        if (sortBy === column) {
            // If clicking on the same column, reverse the sort order
            setSortAsc(!sortAsc);
        } else {
            // If clicking on a different column, set the new column for sorting
            setSortBy(column);
            setSortAsc(true); // Default to ascending order for the new column
        }
    };


    const sorted = [...approvalRequests].sort((a, b) => {
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
                    <SortableHeader column="Approver" title="Approver" handleSort={handleSort} />
                    <SortableHeader column="LeaveRequest" title="Leave Request" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                    </tr>
                </thead>
                <tbody>
                {sorted.map((approvalRequest, idx) => (
                    <tr key={idx}>
                        <td>{approvalRequest.ID}</td>
                        <td>{approvalRequest.Approver}</td>
                        <td>{approvalRequest.LeaveRequest}</td>
                        <td>{approvalRequest.Status}</td>
                        <td>{approvalRequest.Comment}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

interface SortableHeaderProps {
    column: keyof IApprovalRequest;
    title: string;
    handleSort: (column: keyof IApprovalRequest) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, title, handleSort }) => {
    return (
        <th onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
            {title}
        </th>
    );
};

export default LeaveRequestsTable;
