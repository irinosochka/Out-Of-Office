import React, { useState, useEffect } from 'react';
import { IEmployee } from "../../models/IEmployee";
import { subdivisions, positionsBySubdivision } from "../../constants/Lists";
import { addEmployee, getEmployees } from "../../api/EmployeeApi";

interface AddEmployeeFormProps {
    onSubmit: () => void;
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
                    employee.Subdivision === 'HR' && employee.Position === 'HR Manager' &&
                    employee.Status === 'Active'
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
            [name]: name === 'OutOfOfficeBalance' ? Number(value) : value
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
        if (formState.OutOfOfficeBalance < 0) {
            alert('Out-Of-Office Balance cannot be less than 0');
        } else {
            try {
                await addEmployee({
                    ...formState,
                    PeoplePartner: formState.PeoplePartner
                });
                onSubmit();
            } catch (error) {
                console.error('Error adding data:', error);
            }
            onClose();
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Employee</h2>
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
                        <select
                            name="Subdivision"
                            value={formState.Subdivision}
                            onChange={handleSubdivisionChange}
                            required
                        >
                            <option value="">Select Subdivision</option>
                            {subdivisions.map(subdivision => (
                                <option key={subdivision} value={subdivision}>
                                    {subdivision}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Position</label>
                        <select
                            name="Position"
                            value={formState.Position}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Position</option>
                            {formState.Subdivision && positionsBySubdivision[formState.Subdivision].map(position => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>
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
                        <select
                            name="PeoplePartner"
                            value={formState.PeoplePartner.toString()}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select People Partner</option>
                            {hrManagers.map(manager => (
                                <option key={manager.ID} value={manager.ID.toString()}>
                                    {manager.ID} - {manager.FullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Out-Of-Office Balance</label>
                        <input
                            type="number"
                            name="OutOfOfficeBalance"
                            value={formState.OutOfOfficeBalance}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit">Add Employee</button>
                </form>
            </div>
        </div>
    );
};

export default AddEmployeeForm;
