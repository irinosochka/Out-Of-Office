import React, { useState } from 'react';
import { IEmployee } from "../../models/IEmployee";
import Search from "../../common/Search";
import EmployeeModal from "./EmployeeModal";
import { useRole } from "../../context/RoleContext";
import UpdateEmployeeForm from './UpdateEmployeeForm';
import { checkEmployeeReferences, deleteEmployee, updateEmployee } from '../../api/EmployeeApi';

import '../../styles/tableStyles.scss';
import {sortArray} from "../../utils/utils";
import {useSort} from "../../hooks/useSort";
import Modal from "../../common/Modal";
import AddEmployeeForm from "./AddEmployeeForm";

interface EmployeeTableProps {
    employees: IEmployee[];
    setEmployees: React.Dispatch<React.SetStateAction<IEmployee[]>>;
}

const EmployeesTable: React.FC<EmployeeTableProps> = ({ employees, setEmployees }) => {
    const { sortBy, sortAsc, handleSort } = useSort<IEmployee>('ID');
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { selectedRole } = useRole();

    const filteredEmployees = searchTerm
        ? employees.filter(employee =>
            employee.FullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : employees;

    const sortedEmployees = sortArray(filteredEmployees, sortBy, sortAsc);

    const handleAddEmployee = (employee: IEmployee) => {
        setEmployees([...employees, employee]);
    };

    const handleCloseModal = () => {
        setSelectedEmployee(null);
    };

    const handleEditEmployee = (employee: IEmployee) => {
        setEditingEmployee(employee);
    };

    const handleUpdateEmployee = async (updatedEmployee: IEmployee) => {
        try {
            const response = await updateEmployee(updatedEmployee);
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

    const handleStatusChange = async (employee: IEmployee) => {
        const updatedStatus: 'Active' | 'Inactive' = employee.Status === 'Active' ? 'Inactive' : 'Active';
        const updatedEmployee: IEmployee = { ...employee, Status: updatedStatus };
        await handleUpdateEmployee(updatedEmployee);
    };

    const handleDeleteEmployee = async (deletedEmployee: IEmployee) => {
        try {
            const checkReferencesResponse = await checkEmployeeReferences(deletedEmployee.ID);
            if (checkReferencesResponse.data.referenced) {
                alert('Cannot delete employee, they are referenced in projects or as a people partner.');
                return;
            }

            const deleteResponse = await deleteEmployee(deletedEmployee.ID);
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
            {selectedRole === 'HR Manager' &&
                <>
                    <button onClick={() => setIsModalOpen(true)}>Add Employee</button>
                </>
            }
            <table className="table">
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
                                <button onClick={(e) => { e.stopPropagation(); handleStatusChange(employee); }}>
                                    {employee.Status === 'Active' ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); handleDeleteEmployee(employee); }}>Delete with all requests</button>
                            </td>
                        )}
                    </tr>
                ))}
                </tbody>
            </table>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddEmployeeForm
                    onSubmit={handleAddEmployee}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
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
