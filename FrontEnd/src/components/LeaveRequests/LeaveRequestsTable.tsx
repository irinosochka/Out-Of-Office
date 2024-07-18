import React, { useState } from 'react';
import { ILeaveRequest } from '../../models/ILeaveRequest';
import LeaveRequestModal from './LeaveRequestModal';

import '../../styles/tableStyles.scss';
import {sortArray} from "../../utils/utils";
import {useSort} from "../../hooks/useSort";

interface LeaveRequestsTableProps {
    leaveRequests: ILeaveRequest[];
}

const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({ leaveRequests }) => {
    const { sortBy, sortAsc, handleSort } = useSort<ILeaveRequest>('ID');
    const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<ILeaveRequest | null>(null);

    const sorted = sortArray(leaveRequests, sortBy, sortAsc);

    const handleRowClick = (leaveRequest: ILeaveRequest) => {
        setSelectedLeaveRequest(leaveRequest);
    };

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                    <SortableHeader column="EmployeeID" title="Employee ID" handleSort={handleSort} />
                    <SortableHeader column="AbsenceReason" title="Absence Reason" handleSort={handleSort} />
                    <SortableHeader column="StartDate" title="Start Date" handleSort={handleSort} />
                    <SortableHeader column="EndDate" title="End Date" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                </tr>
                </thead>
                <tbody>
                {sorted.map((leaveRequest, idx) => (
                    <tr key={idx} onClick={() => handleRowClick(leaveRequest)} style={{ cursor: 'pointer' }}>
                        <td>{leaveRequest.ID}</td>
                        <td>{leaveRequest.EmployeeID}</td>
                        <td>{leaveRequest.AbsenceReason}</td>
                        <td>{new Date(leaveRequest.StartDate).toLocaleDateString()}</td>
                        <td>{new Date(leaveRequest.EndDate).toLocaleDateString()}</td>
                        <td>{leaveRequest.Status}</td>
                        <td>{leaveRequest.Comment}</td>
                    </tr>
                ))}
                </tbody>
            </table>
            <LeaveRequestModal isOpen={selectedLeaveRequest !== null} onClose={() => setSelectedLeaveRequest(null)} leaveRequest={selectedLeaveRequest} />
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
