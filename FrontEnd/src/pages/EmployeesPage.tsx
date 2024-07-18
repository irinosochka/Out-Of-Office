import React, { useEffect, useState } from 'react';
import {IEmployee} from "../models/IEmployee";
import EmployeesTable from "../components/Employees/EmployeesTable";
import {getEmployees} from "../api/EmployeeApi";

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);

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
        <EmployeesTable
            employees={employees}
            setEmployees={setEmployees}
        />
    );
};

export default EmployeesPage;
