import axios from 'axios';
import {IApprovalRequest} from "../models/IApprovalRequest";

const API_URL = 'http://localhost:8082/Lists/ApprovalRequests';

export const getApprovalRequests = async () => {
    return axios.get<IApprovalRequest[]>(`${API_URL}`);
}

export const addApprovalRequest = async (approvalRequest: Omit<IApprovalRequest, "ID">) => {
    return axios.post<IApprovalRequest>(`${API_URL}`, approvalRequest);
}

export const deleteApprovalRequest = async (approvalRequestId: number) => {
    return axios.delete(`${API_URL}/${approvalRequestId}`);
};

export const updateApprovalRequest = async (approvalRequest: IApprovalRequest) => {
    return axios.put(`${API_URL}/${approvalRequest.ID}`, approvalRequest);
};

