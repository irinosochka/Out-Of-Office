import React from 'react';
import { IProject } from "../../models/IProject";
import {IEmployee} from "../../models/IEmployee";

interface ProjectModalProps {
    project: IProject | null;
    onClose: () => void;
    projectManagers: IEmployee[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, projectManagers }) => {
    if (!project) return null;

    const projectManager = projectManagers.find(pm => pm.ID === project.ProjectManager);


    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Project Details</h2>
                <p><strong>ID:</strong> {project.ID}</p>
                <p><strong>ProjectType:</strong> {project.ProjectType}</p>
                <p><strong>Start Date:</strong> {new Date(project.StartDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {project.EndDate ? new Date(project.EndDate).toLocaleDateString() : undefined}</p>
                <p><strong>Project Manager:</strong> {projectManager ? `${projectManager.FullName} (ID: ${projectManager.ID})` : 'Unknown'}</p>
                <p><strong>Status:</strong> {project.Status}</p>
                <p><strong>Comment:</strong> {project.Comment}</p>
            </div>
        </div>
    );
};

export default ProjectModal;
