import React, { useState, useEffect } from 'react';
import { IEmployee } from "../../models/IEmployee";
import { subdivisions, positionsBySubdivision } from "../../constants/Lists";
import {addEmployee, getEmployees} from "../../api/EmployeeApi";


interface AddEmployeeFormProps {
    onSubmit: (employee: IEmployee) => void;
    onClose: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSubmit, onClose }) => {
    const [formState, setFormState] = useState<Omit<IEmployee, 'ID'>>({
        FullName: '',
        Subdivision: '',
        Position: '',
        Status: 'Active',
        PeoplePartner: 0,
        OutOfOfficeBalance: 0,
    });

    const [hrManagers, setHrManagers] = useState<IEmployee[]>([]);

    useEffect(() => {
        const fetchHRManagers = async () => {
            try {
                const response = await getEmployees();
                const filteredManagers = response.data.filter(employee =>
                    employee.Subdivision === 'HR' && employee.Position === 'HR Manager'
                );
                setHrManagers(filteredManagers);
            } catch (error) {
                console.error('Error fetching HR managers:', error);
            }
        };

        fetchHRManagers();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubdivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { value } = e.target;
        setFormState({
            ...formState,
            Subdivision: value,
            Position: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(formState.OutOfOfficeBalance < 0){
            alert('Out-Of-Office Balance cannot be less then 0')
        } else {
            try {
                const response = await addEmployee({
                    ...formState,
                    PeoplePartner: formState.PeoplePartner
                });
                onSubmit(response.data);
            } catch (error) {
                console.error('Error adding data:', error);
            }
            onClose();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Full Name</label>
                <input name="FullName" value={formState.FullName} onChange={handleChange} required />
            </div>
            <div>
                <label>Subdivision</label>
                <select name="Subdivision" value={formState.Subdivision} onChange={handleSubdivisionChange} required>
                    <option value="">Select Subdivision</option>
                    {subdivisions.map(subdivision => (
                        <option key={subdivision} value={subdivision}>
                            {subdivision}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Position</label>
                <select name="Position" value={formState.Position} onChange={handleChange} required>
                    <option value="">Select Position</option>
                    {formState.Subdivision && positionsBySubdivision[formState.Subdivision].map(position => (
                        <option key={position} value={position}>
                            {position}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Status</label>
                <select name="Status" value={formState.Status} onChange={handleChange} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <div>
                <label>People Partner</label>
                <select name="PeoplePartner" value={formState.PeoplePartner.toString()} onChange={handleChange} required>
                    <option value="">Select People Partner</option>
                    {hrManagers.map(manager => (
                        <option key={manager.ID} value={manager.ID.toString()}>
                            {manager.ID} - {manager.FullName}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Out-Of-Office Balance</label>
                <input type="number" name="OutOfOfficeBalance" value={formState.OutOfOfficeBalance} onChange={handleChange} required />
            </div>
            <button type="submit">Add Employee</button>
        </form>
    );
};

export default AddEmployeeForm;
