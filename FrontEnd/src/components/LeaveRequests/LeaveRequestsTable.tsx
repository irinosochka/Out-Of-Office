import React, { useState } from 'react';
import { ILeaveRequest } from '../../models/ILeaveRequest';
import '../../styles/tableStyles.scss';
import { sortArray } from "../../utils/utils";
import { useSort } from "../../hooks/useSort";
import Search from "../../common/Search";

interface LeaveRequestsTableProps {
    leaveRequests: ILeaveRequest[];
    employeeMap: { [key: number]: string };
    isEmp: boolean;
    setShowAddingForm: (open: boolean) => void;
    setSelectedRequest: (request: ILeaveRequest) => void;
    handleEditRequest: (request: ILeaveRequest) => void;
    handleStatusChange: (request: ILeaveRequest, updatedStatus: 'Submitted' | 'Canceled') => void;
    handleDeleteRequest: (request: ILeaveRequest) => void;
}

const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({
                                                                   leaveRequests,
                                                                   employeeMap,
                                                                   isEmp,
                                                                   setShowAddingForm,
                                                                   setSelectedRequest,
                                                                   handleDeleteRequest,
                                                                   handleEditRequest,
                                                                   handleStatusChange,
                                                               }) => {
    const { sortBy, sortAsc, handleSort } = useSort<ILeaveRequest>('ID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredRequests = searchTerm
        ? leaveRequests.filter(request => request.ID.toString().includes(searchTerm))
        : leaveRequests;

    const sorted = sortArray(filteredRequests, sortBy, sortAsc);

    return (
        <>
            <div className="header-container">
                <div className="table-search">
                    <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by id..." />
                </div>
                {isEmp && (
                    <button className="btn-add" onClick={() => setShowAddingForm(true)}>
                        <span>+</span> Add
                    </button>
                )}
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                        <SortableHeader column="EmployeeID" title="Employee" handleSort={handleSort} />
                        <SortableHeader column="AbsenceReason" title="Absence Reason" handleSort={handleSort} />
                        <SortableHeader column="StartDate" title="Start Date" handleSort={handleSort} />
                        <SortableHeader column="EndDate" title="End Date" handleSort={handleSort} />
                        <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                        <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                        {isEmp && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sorted.map((leaveRequest, idx) => (
                        <tr
                            key={idx}
                            onClick={() => setSelectedRequest(leaveRequest)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{leaveRequest.ID}</td>
                            <td>{employeeMap[leaveRequest.EmployeeID] || leaveRequest.EmployeeID}</td>
                            <td>{leaveRequest.AbsenceReason}</td>
                            <td>{new Date(leaveRequest.StartDate).toLocaleDateString()}</td>
                            <td>{new Date(leaveRequest.EndDate).toLocaleDateString()}</td>
                            <td>{leaveRequest.Status}</td>
                            <td>{leaveRequest.Comment}</td>
                            {isEmp && (
                                <td>
                                    {leaveRequest.Status === 'New' && (
                                        <>
                                            <button
                                                className="btn-edit"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditRequest(leaveRequest);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-action"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(leaveRequest, 'Submitted');
                                                }}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                className="btn-action"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStatusChange(leaveRequest, 'Canceled');
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteRequest(leaveRequest);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
                                    {leaveRequest.Status === 'Submitted' && (
                                        <button
                                            className="btn-action"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStatusChange(leaveRequest, 'Canceled');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
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
