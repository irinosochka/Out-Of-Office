import React, { useEffect, useState } from 'react';
import {IEmployee} from "../models/IEmployee";
import EmployeesTable from "../components/Employees/EmployeesTable";
import Modal from "../common/Modal";
import AddEmployeeForm from "../components/Employees/AddEmployeeForm";
import {useRole} from "../context/RoleContext";
import {getEmployees} from "../api/EmployeeApi";

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { selectedRole } = useRole();

    const handleAddEmployee = (employee: IEmployee) => {
        setEmployees([...employees, employee]);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <div>
            {selectedRole === 'HR Manager' &&
                <>
                    <button onClick={() => setIsModalOpen(true)}>Add Employee</button>
                    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <AddEmployeeForm
                            onSubmit={handleAddEmployee}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </Modal>
                </>
            }
            <EmployeesTable employees={employees} setEmployees={setEmployees} />
        </div>
    );
};

export default EmployeesPage;
