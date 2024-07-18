import axios from 'axios';
import {IProject} from "../models/IProject";

const API_URL = 'http://localhost:8082/Lists/Projects';

export const getProjects = async () => {
    return axios.get<IProject[]>(`${API_URL}`);
}

export const addProject = async (project: { StartDate: string; Status: "Active" | "Inactive"; Comment?: string; ProjectType: string; EndDate: string | null; ProjectManager: number }) => {
    return axios.post<IProject>(`${API_URL}`, project);
}

export const deleteProject = async (projectId: number) => {
    return axios.delete(`${API_URL}/${projectId}`);
};

export const updateProject = async (project: { StartDate: string; Status: "Active" | "Inactive"; Comment?: string; ProjectType: string; ID: number; EndDate: string | null; ProjectManager: number }) => {
    return axios.put(`${API_URL}/${project.ID}`, project);
};

