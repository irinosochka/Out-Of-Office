import React, {useState} from 'react';
import {IApprovalRequest} from "../../models/IApprovalRequest";

import '../../styles/tableStyles.scss';
import {sortArray} from "../../utils/utils";
import {useSort} from "../../hooks/useSort";
import Search from "../../common/Search";

interface ApprovalRequestsTableProps {
    approvalRequests: IApprovalRequest[];
    handleStatusChange: (request: IApprovalRequest, updatedStatus: 'Approved' | 'Rejected') => void;
}

const ApprovalRequestsTable: React.FC<ApprovalRequestsTableProps> = ({
                                                                         approvalRequests,
                                                                         handleStatusChange,
                                                                     }) => {
    const { sortBy, sortAsc, handleSort } = useSort<IApprovalRequest>('ID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredRequests = searchTerm
        ? approvalRequests.filter(request => request.ID.toString().includes(searchTerm))
        : approvalRequests;

    const sorted = sortArray(filteredRequests, sortBy, sortAsc);

    return (
        <>
            <div className="header-container">
                <div className="table-search">
                    <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by id..." />
                </div>
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                        <SortableHeader column="Approver" title="Approver" handleSort={handleSort} />
                        <SortableHeader column="LeaveRequestID" title="Leave Request ID" handleSort={handleSort} />
                        <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                        <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                        <th>Actions</th>
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
                            <td>
                                {approvalRequest.Status === 'New' && (
                                    <>
                                        <button
                                            className="btn-action"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(approvalRequest, 'Approved');
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn-action"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(approvalRequest, 'Rejected');
                                            }}
                                        >
                                            Reject
                                        </button>

                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
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
