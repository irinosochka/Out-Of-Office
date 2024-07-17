import axios from 'axios';
import { IEmployee } from '../models/IEmployee';

const API_URL = 'http://localhost:8082/Lists/Employees';

export const checkEmployeeReferences = async (employeeId: number) => {
    return axios.get<{ referenced: boolean }>(`${API_URL}/${employeeId}/checkReferences`);
};

export const deleteEmployee = async (employeeId: number) => {
    return axios.delete(`${API_URL}/${employeeId}`);
};

export const updateEmployee = async (employee: IEmployee) => {
    return axios.put(`${API_URL}/${employee.ID}`, employee);
};
