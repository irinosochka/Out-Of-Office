import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { ILeaveRequest } from "../../models/ILeaveRequest";
import { IEmployee } from "../../models/IEmployee";
import { getEmployees } from "../../api/EmployeeApi";
import { addLeaveRequest } from "../../api/LeaveRequestApi";

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
    const [employees, setEmployees] = useState<IEmployee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await getEmployees();
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'StartDate' || name === 'EndDate') {
            setFormState({
                ...formState,
                [name]: new Date(value)
            });
        } else if (name === 'EmployeeID') {
            setFormState({
                ...formState,
                EmployeeID: Number(value)
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
                EndDate: moment(formState.EndDate).format('YYYY-MM-DD')
            };
            const response = await addLeaveRequest(formattedFormState);
            onSubmit(response.data);
        } catch (error) {
            console.error('Error adding data:', error);
        }
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Leave Request</h2>
                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Employee</label>
                        <select
                            name="EmployeeID"
                            value={formState.EmployeeID.toString()}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Employee</option>
                            {employees.map(emp => (
                                <option key={emp.ID} value={emp.ID}>
                                    {emp.ID} - {emp.FullName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Absence Reason</label>
                        <input
                            name="AbsenceReason"
                            value={formState.AbsenceReason}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Start Date</label>
                        <input
                            type="date"
                            name="StartDate"
                            value={moment(formState.StartDate).format('YYYY-MM-DD')}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>End Date</label>
                        <input
                            type="date"
                            name="EndDate"
                            value={moment(formState.EndDate).format('YYYY-MM-DD')}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Comment</label>
                        <input
                            name="Comment"
                            value={formState.Comment}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Status</label>
                        <select
                            name="Status"
                            value={formState.Status}
                            onChange={handleChange}
                            required
                            disabled
                        >
                            <option value="New">New</option>
                        </select>
                    </div>
                    <button type="submit">Add Request</button>
                </form>
            </div>
        </div>
    );
};

export default AddLeaveRequestForm;
