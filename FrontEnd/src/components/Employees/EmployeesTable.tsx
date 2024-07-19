import React, { useState } from 'react';
import { IEmployee } from '../../models/IEmployee';
import Search from '../../common/Search';
import '../../styles/tableStyles.scss';
import { sortArray } from '../../utils/utils';
import { useSort } from '../../hooks/useSort';

interface EmployeeTableProps {
    employees: IEmployee[];
    isHR: boolean;
    setShowAddingForm: (open: boolean) => void;
    setSelectedEmployee: (employee: IEmployee) => void;
    handleEditEmployee: (employee: IEmployee) => void;
    handleStatusChange: (employee: IEmployee) => void;
    handleDeleteEmployee: (employee: IEmployee) => void;
}

const EmployeesTable: React.FC<EmployeeTableProps> = ({
                                                          employees,
                                                          isHR,
                                                          setShowAddingForm,
                                                          setSelectedEmployee,
                                                          handleEditEmployee,
                                                          handleDeleteEmployee,
                                                          handleStatusChange,
                                                      }) => {
    const { sortBy, sortAsc, handleSort } = useSort<IEmployee>('ID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredEmployees = searchTerm
        ? employees.filter((employee) =>
            employee.FullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : employees;

    const sortedEmployees = sortArray(filteredEmployees, sortBy, sortAsc);

    return (
        <>
            <div className="header-container">
                <div className="table-search">
                    <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by full name..." />
                </div>
                {isHR && (
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
                        {/*<SortableHeader column="Photo" title="Photo" handleSort={handleSort} />*/}
                        <SortableHeader column="FullName" title="Full Name" handleSort={handleSort} />
                        <SortableHeader column="Subdivision" title="Subdivision" handleSort={handleSort} />
                        <SortableHeader column="Position" title="Position" handleSort={handleSort} />
                        <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                        <SortableHeader column="PeoplePartner" title="People Partner" handleSort={handleSort} />
                        <SortableHeader column="OutOfOfficeBalance" title="Out Of Office Balance" handleSort={handleSort} />
                        {isHR && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sortedEmployees.map((employee, idx) => (
                        <tr
                            key={idx}
                            onClick={() => setSelectedEmployee(employee)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{employee.ID}</td>
                            {/*<td>{employee.Photo}</td>*/}
                            <td>{employee.FullName}</td>
                            <td>{employee.Subdivision}</td>
                            <td>{employee.Position}</td>
                            <td>{employee.Status}</td>
                            <td>{employee.PeoplePartner}</td>
                            <td>{employee.OutOfOfficeBalance}</td>
                            {isHR && (
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditEmployee(employee);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`btn-action ${employee.Status === 'Active' ? 'btn-deactivate' : 'btn-activate'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(employee);
                                        }}
                                    >
                                        {employee.Status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteEmployee(employee);
                                        }}
                                    >
                                        Delete
                                    </button>
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
