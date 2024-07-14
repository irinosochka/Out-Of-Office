import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RoleContextProps {
    selectedRole: string;
    setSelectedRole: (role: string) => void;
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
};

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [selectedRole, setSelectedRole] = useState<string>('');

    return (
        <RoleContext.Provider value={{ selectedRole, setSelectedRole }}>
            {children}
        </RoleContext.Provider>
    );
};
