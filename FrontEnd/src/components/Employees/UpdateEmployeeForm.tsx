import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IEmployee } from '../../models/IEmployee';

interface UpdateEmployeeFormProps {
    employee: IEmployee;
    onSubmit: (updatedEmployee: IEmployee) => void;
    onClose: () => void;
}

const UpdateEmployeeForm: React.FC<UpdateEmployeeFormProps> = ({ employee, onSubmit, onClose }) => {
    const [formState, setFormState] = useState<IEmployee>(employee);

    useEffect(() => {
        setFormState(employee);
    }, [employee]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.put<IEmployee>(`http://localhost:8082/Lists/Employees/${formState.ID}`, formState);
            onSubmit(response.data);
        } catch (error) {
            console.error('Error updating data:', error);
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Full Name</label>
                <input name="FullName" value={formState.FullName} onChange={handleChange} required />
            </div>
            <div>
                <label>Subdivision</label>
                <input name="Subdivision" value={formState.Subdivision} onChange={handleChange} required />
            </div>
            <div>
                <label>Position</label>
                <input name="Position" value={formState.Position} onChange={handleChange} required />
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
                <input type="number" name="PeoplePartner" value={formState.PeoplePartner} onChange={handleChange} required />
            </div>
            <div>
                <label>Out Of Office Balance</label>
                <input type="number" name="OutOfOfficeBalance" value={formState.OutOfOfficeBalance} onChange={handleChange} required />
            </div>
            <div>
                <label>Photo</label>
                <input type="file" name="Photo" value={formState.Photo} onChange={handleChange} />
            </div>
            <button type="submit">Update Employee</button>
        </form>
    );
};

export default UpdateEmployeeForm;
