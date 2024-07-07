import React, { useState } from 'react';
import { IEmployee } from '../models/IEmployee';

interface AddEmployeeFormProps {
    onSubmit: (employee: IEmployee) => void;
    onClose: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSubmit, onClose }) => {
    const [formState, setFormState] = useState<Omit<IEmployee, 'EmployeeID'>>({
        FullName: '',
        Subdivision: '',
        Position: '',
        Status: 'Active',
        PeoplePartner: 0,
        OutOfOfficeBalance: 0,
        Photo: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            EmployeeID: Math.floor(Math.random() * 1000), // Generate a random ID for demo purposes
            ...formState
        });
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
            <button type="submit">Add Employee</button>
        </form>
    );
};

export default AddEmployeeForm;
