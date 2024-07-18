import React from 'react';
import {IApprovalRequest} from "../../models/IApprovalRequest";

import '../../styles/tableStyles.scss';
import {sortArray} from "../../utils/utils";
import {useSort} from "../../hooks/useSort";

interface ApprovalRequestsTableProps {
    approvalRequests: IApprovalRequest[];
}

const ApprovalRequestsTable: React.FC<ApprovalRequestsTableProps> = ({ approvalRequests }) => {
    const { sortBy, sortAsc, handleSort } = useSort<IApprovalRequest>('ID');

    const sorted = sortArray(approvalRequests, sortBy, sortAsc);

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                    <SortableHeader column="Approver" title="Approver" handleSort={handleSort} />
                    <SortableHeader column="LeaveRequestID" title="Leave Request ID" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                    </tr>
                </thead>
                <tbody>
                {sorted.map((approvalRequest, idx) => (
                    <tr key={idx}>
                        <td>{approvalRequest.ID}</td>
                        <td>{approvalRequest.Approver}</td>
                        <td>{approvalRequest.LeaveRequestID}</td>
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

export default ApprovalRequestsTable;
