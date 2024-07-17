import React, { useState } from 'react';
import axios from 'axios';
import moment from "moment";
import {ILeaveRequest} from "../../models/ILeaveRequests";

interface AddLeaveRequestFormProps {
    onSubmit: (leaveRequest: ILeaveRequest) => void;
    onClose: () => void;
}

const AddLeaveRequestForm: React.FC<AddLeaveRequestFormProps> = ({ onSubmit, onClose }) => {
    const [formState, setFormState] = useState<Omit<ILeaveRequest, 'ID'>>({
        EmployeeID: 0,
        AbsenceReason: '',
        StartDate: new Date(),
        EndDate: new Date(),
        Comment: '',
        Status: 'New'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if(name === 'StartDate' || name === 'EndDate'){
            setFormState({
                ...formState,
                [name]: new Date(value)
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
                EndDate: moment(formState.EndDate).format('YYYY-MM-DD')
            };
            const response = await axios.post<ILeaveRequest>('http://localhost:8082/Lists/LeaveRequests', formattedFormState);
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
                <label>Employee ID</label>
                <input type="number" name="EmployeeID" value={formState.EmployeeID} onChange={handleChange} required />
            </div>
            <div>
                <label>Absence Reason</label>
                <input name="AbsenceReason" value={formState.AbsenceReason} onChange={handleChange} required />
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
                       value={moment(formState.EndDate).format('YYYY-MM-DD')}
                       onChange={handleChange} required/>
            </div>
            <div>
                <label>Comment</label>
                <input name="Comment" value={formState.Comment} onChange={handleChange}/>
            </div>
            <div>
                <label>Status</label>
                <select name="Status" value={formState.Status} onChange={handleChange} required disabled>
                    <option value="New">New</option>
                </select>
            </div>
            <button type="submit">Add Request</button>
        </form>
    );
};

export default AddLeaveRequestForm;
