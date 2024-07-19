import axios from 'axios';
import {ILeaveRequest} from "../models/ILeaveRequest";


const API_URL = 'http://localhost:8082/Lists/LeaveRequests';

export const getLeaveRequests = async () => {
    return axios.get<ILeaveRequest[]>(`${API_URL}`);
}

export const addLeaveRequest = async (leaveRequest: { StartDate: string; Status: 'New' | 'Submitted' | 'Canceled' | 'Approved' | 'Rejected'; Comment?: string; AbsenceReason: string; EmployeeID: number; EndDate: string }) => {
    return axios.post<ILeaveRequest>(`${API_URL}`, leaveRequest);
}

export const deleteLeaveRequest = async (leaveRequestId: number) => {
    return axios.delete(`${API_URL}/${leaveRequestId}`);
};

export const updateLeaveRequest = async (leaveRequest: { StartDate: string; Status: 'New' | 'Submitted' | 'Canceled' | 'Approved' | 'Rejected'; Comment?: string; AbsenceReason: string; ID: number; EmployeeID: number; EndDate: string }) => {
    return axios.put(`${API_URL}/${leaveRequest.ID}`, leaveRequest);
};

export const getLeaveRequestById = async (leaveRequestId: number) => {
    return axios.get<ILeaveRequest>(`${API_URL}/${leaveRequestId}`);
};

