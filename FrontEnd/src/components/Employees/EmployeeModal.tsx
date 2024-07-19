import React from 'react';
import { IEmployee } from "../../models/IEmployee";

import '../../styles/modalStyles.scss'

interface EmployeeModalProps {
    employee: IEmployee | null;
    onClose: () => void;
}

const EmployeeModal: React.FC<EmployeeModalProps> = ({ employee, onClose }) => {
    if (!employee) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Employee Details</h2>
                <p><strong>ID:</strong> {employee.ID}</p>
                <p><strong>Photo:</strong> {employee.Photo}</p>
                <p><strong>Full Name:</strong> {employee.FullName}</p>
                <p><strong>Subdivision:</strong> {employee.Subdivision}</p>
                <p><strong>Position:</strong> {employee.Position}</p>
                <p><strong>Status:</strong> {employee.Status}</p>
                <p><strong>People Partner:</strong> {employee.PeoplePartner}</p>
                <p><strong>Out Of Office Balance:</strong> {employee.OutOfOfficeBalance}</p>
            </div>
        </div>
    );
};

export default EmployeeModal;
