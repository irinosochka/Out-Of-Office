import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {IEmployee} from "../models/IEmployee";
import EmployeesTable from "../components/EmployeesTable";

const EmployeesPage: React.FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get<IEmployee[]>('http://localhost:8082/Lists/Employees');
                console.log(response.data); // Check the structure and contents
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <div>
            <h2>Employee Table</h2>
            <EmployeesTable employees={employees} />
        </div>
    );
};

export default EmployeesPage;
