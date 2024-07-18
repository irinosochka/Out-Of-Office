import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { IProject } from "../../models/IProject";
import { projectTypes } from "../../constants/Lists";
import { IEmployee } from "../../models/IEmployee";
import { getEmployees } from "../../api/EmployeeApi";
import {updateProject} from "../../api/ProjectApi";

interface UpdateProjectFormProps {
    project: IProject;
    onSubmit: (project: IProject) => void;
    onClose: () => void;
}

const UpdateProjectForm: React.FC<UpdateProjectFormProps> = ({ project, onSubmit, onClose }) => {
    const [formState, setFormState] = useState<IProject>(project);
    const [pM, setPM] = useState<IEmployee[]>([]);

    useEffect(() => {
        const fetchPM = async () => {
            try {
                const response = await getEmployees();
                const filteredPM = response.data.filter(employee =>
                    employee.Subdivision === 'Product Management' && employee.Position === 'Project Manager' &&
                    employee.Status === 'Active'
                );
                setPM(filteredPM);
            } catch (error) {
                console.error('Error fetching Project Managers:', error);
            }
        };
        fetchPM();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'StartDate' || name === 'EndDate') {
            setFormState({
                ...formState,
                [name]: new Date(value)
            });
        } else {
            setFormState({
                ...formState,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const startDate = moment(formState.StartDate).startOf('day');
            const endDate = formState.EndDate ? moment(formState.EndDate).startOf('day') : null;

            if (endDate && startDate.isAfter(endDate)) {
                alert('End Date cannot be earlier than Start Date');
                return;
            }

            const formattedFormState = {
                ...formState,
                StartDate: moment(formState.StartDate).format('YYYY-MM-DD'),
                EndDate: formState.EndDate ? moment(formState.EndDate).format('YYYY-MM-DD') : null,
            };

            const response = await updateProject(formattedFormState);
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
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Project Type</label>
                        <select name="ProjectType" value={formState.ProjectType} onChange={handleChange} required>
                            <option value="">Select Project Type</option>
                            {projectTypes.map(projectType => (
                                <option key={projectType} value={projectType}>
                                    {projectType}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Start Date</label>
                        <input type="date" name="StartDate"
                               value={moment(formState.StartDate).format('YYYY-MM-DD')}
                               onChange={handleChange} required />
                    </div>
                    <div>
                        <label>End Date</label>
                        <input type="date" name="EndDate"
                               value={formState.EndDate ? moment(formState.EndDate).format('YYYY-MM-DD') : ''}
                               onChange={handleChange} />
                    </div>
                    <div>
                        <label>Project Manager</label>
                        <select name="ProjectManager" value={formState.ProjectManager.toString()} onChange={handleChange} required>
                            <option value="">Select Project Manager</option>
                            {pM.map(pm => (
                                <option key={pm.ID} value={pm.ID.toString()}>
                                    {pm.ID} - {pm.FullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Comment</label>
                        <input name="Comment" value={formState.Comment} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Status</label>
                        <select name="Status" value={formState.Status} onChange={handleChange} required>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                    <button type="submit">Update Project</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProjectForm;
