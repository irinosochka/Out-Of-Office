import React, { useState } from 'react';

import '../styles/pageStyles.scss'

interface RoleSelectionProps {
    onRoleSelect: (role: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelect }) => {
    const [selectedRole, setSelectedRole] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        setSelectedRole(selectedValue);
        onRoleSelect(selectedValue);
    };

    return (
        <div className="role-selection">
            <label htmlFor="role">Choose your role:</label>
            <select id="role" value={selectedRole} onChange={handleChange} className="role-select">
                <option value="">Select a role</option>
                <option value="Employee">Employee</option>
                <option value="HR Manager">HR Manager</option>
                <option value="Project Manager">Project Manager</option>
            </select>
        </div>
    );
};

export default RoleSelection;
