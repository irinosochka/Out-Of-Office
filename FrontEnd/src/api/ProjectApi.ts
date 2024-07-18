import axios from 'axios';
import {IProject} from "../models/IProjects";

const API_URL = 'http://localhost:8082/Lists/Projects';

export const getProjects = async () => {
    return axios.get<IProject[]>(`${API_URL}`);
}

export const addProject = async (project: Omit<IProject, 'ID'>) => {
    return axios.post<IProject>(`${API_URL}`, project);
}

export const deleteProject = async (projectId: number) => {
    return axios.delete(`${API_URL}/${projectId}`);
};

export const updateProject = async (project: IProject) => {
    return axios.put(`${API_URL}/${project.ID}`, project);
};

