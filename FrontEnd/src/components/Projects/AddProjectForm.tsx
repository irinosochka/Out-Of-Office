import React, { useState } from 'react';
import axios from 'axios';
import {IProject} from "../../models/IProjects";
import moment from "moment";

interface AddEmployeeFormProps {
    onSubmit: (employee: IProject) => void;
    onClose: () => void;
}

const AddEmployeeForm: React.FC<AddEmployeeFormProps> = ({ onSubmit, onClose }) => {
    const [formState, setFormState] = useState<Omit<IProject, 'ID'>>({
        ProjectType: '',
        StartDate: new Date(),
        EndDate: undefined,
        ProjectManager: 0,
        Comment: '',
        Status: 'Active'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(name === 'StartDate' || name === 'EndDate'){
            setFormState({
                ...formState,
                [name]: value ? new Date(value) : undefined
            });
        }
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formattedFormState = {
                ...formState,
                StartDate: moment(formState.StartDate).format('YYYY-MM-DD'),
                EndDate: formState.EndDate ? moment(formState.EndDate).format('YYYY-MM-DD') : null,
            };
            const response = await axios.post<IProject>('http://localhost:8082/Lists/Projects', formattedFormState);
            onSubmit(response.data);
            console.log(response.data); // Check the structure and contents
        } catch (error) {
            console.error('Error adding data:', error);
        }
        console.log(new Date(formState.StartDate))
        onClose();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Project Type</label>
                <input name="ProjectType" value={formState.ProjectType} onChange={handleChange} required />
            </div>
            <div>
                <label>Start Date</label>
                <input type="date" name="StartDate"
                       value={moment(formState.StartDate).format('YYYY-MM-DD')}
                       onChange={handleChange} required />
            </div>
            <div>
                <label>EndDate</label>
                <input type="date" name="EndDate"
                       value={formState.EndDate ? moment(formState.EndDate).format('YYYY-MM-DD') : ''}
                       onChange={handleChange}/>
            </div>
            <div>
                <label>ProjectManager</label>
                <input type="number" name="ProjectManager" value={formState.ProjectManager} onChange={handleChange} required />
            </div>
            <div>
                <label>Comment</label>
                <input name="Comment" value={formState.Comment} onChange={handleChange}/>
            </div>
            <div>
                <label>Status</label>
                <select name="Status" value={formState.Status} onChange={handleChange} required>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
            <button type="submit">Add Project</button>
        </form>
    );
};

export default AddEmployeeForm;

