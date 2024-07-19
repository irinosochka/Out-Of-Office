import React, { useState, useEffect } from 'react';
import { IEmployee } from '../../models/IEmployee';
import {updateEmployee} from "../../api/EmployeeApi";

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
            const response = await updateEmployee(formState);
            onSubmit(response.data);
        } catch (error) {
            console.error('Error updating data:', error);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Update Employee</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            name="FullName"
                            value={formState.FullName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Subdivision</label>
                        <input
                            name="Subdivision"
                            value={formState.Subdivision}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <input
                            name="Position"
                            value={formState.Position}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="Status"
                            value={formState.Status}
                            onChange={handleChange}
                            required
                        >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>People Partner</label>
                        <input
                            type="number"
                            name="PeoplePartner"
                            value={formState.PeoplePartner}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Out Of Office Balance</label>
                        <input
                            type="number"
                            name="OutOfOfficeBalance"
                            value={formState.OutOfOfficeBalance}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Photo</label>
                        <input
                            type="file"
                            name="Photo"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit">Update Employee</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateEmployeeForm;
