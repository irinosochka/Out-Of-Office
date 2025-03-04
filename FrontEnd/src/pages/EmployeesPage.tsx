import React, { useEffect, useState } from 'react';
import { IEmployee } from '../models/IEmployee';
import EmployeesTable from '../components/Employees/EmployeesTable';
import { checkEmployeeReferences, deleteEmployee, getEmployees, updateEmployee, getEmployeeById } from '../api/EmployeeApi';
import { useRole } from '../context/RoleContext';
import AddEmployeeForm from '../components/Employees/AddEmployeeForm';
import EmployeeModal from '../components/Employees/EmployeeModal';
import UpdateEmployeeForm from '../components/Employees/UpdateEmployeeForm';

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [peoplePartners, setPeoplePartners] = useState<{ [key: number]: string }>({});
    const [showAddingForm, setShowAddingForm] = useState<boolean>(false);
    const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
    const [editingEmployee, setEditingEmployee] = useState<IEmployee | null>(null);
    const { selectedRole } = useRole();

    const isHR = () => selectedRole === 'HR Manager';

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                setEmployees(response.data);
                const peoplePartnersData = await getPeoplePartners(response.data);
                setPeoplePartners(peoplePartnersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);

    const getPeoplePartners = async (employees: IEmployee[]) => {
        const peoplePartnersData: { [key: number]: string } = {};
        await Promise.all(
            employees.map(async (employee) => {
                if (employee.PeoplePartner) {
                    const response = await getEmployeeById(employee.PeoplePartner);
                    peoplePartnersData[employee.PeoplePartner] = `${employee.PeoplePartner} - ${response.data.FullName}`;
                }
            })
        );
        return peoplePartnersData;
    };

    const handleAddEmployee = async () => {
        try {
            const response = await getEmployees();
            setEmployees(response.data);
            const peoplePartnersData = await getPeoplePartners(response.data);
            setPeoplePartners(peoplePartnersData);
        } catch (error) {
            console.error('Error fetching updated employee list:', error);
        }
    };

    const handleCloseAdding = () => {
        setShowAddingForm(false);
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
                console.log('Employee updated:', response.data);
            } else {
                console.error('Failed to update employee, status:', response.status);
            }
        } catch (error) {
            console.error('Failed to update employee:', error);
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
                console.log('Employee deleted:', deletedEmployee);
            } else {
                console.error('Failed to delete employee, status:', deleteResponse.status);
            }
        } catch (error) {
            console.error('Failed to delete employee:', error);
        }
    };

    return (
        <>
            <EmployeesTable
                employees={employees}
                peoplePartners={peoplePartners}
                isHR={isHR()}
                setShowAddingForm={setShowAddingForm}
                setSelectedEmployee={setSelectedEmployee}
                handleEditEmployee={handleEditEmployee}
                handleStatusChange={handleStatusChange}
                handleDeleteEmployee={handleDeleteEmployee}
            />
            {showAddingForm && (
                <AddEmployeeForm
                    onSubmit={handleAddEmployee}
                    onClose={() => handleCloseAdding()}
                />
            )}
            {selectedEmployee && (
                <EmployeeModal
                    employee={selectedEmployee}
                    onClose={() =>  setSelectedEmployee(null)}
                    peoplePartners={peoplePartners}
                />
            )}
            {editingEmployee && (
                <UpdateEmployeeForm
                    employee={editingEmployee}
                    onSubmit={handleUpdateEmployee}
                    onClose={() => setEditingEmployee(null)}
                />
            )}
        </>
    );
};

export default EmployeesPage;
