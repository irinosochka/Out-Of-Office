import React from 'react';
import { IProject } from "../../models/IProject";

interface ProjectModalProps {
    project: IProject | null;
    onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Project Details</h2>
                <p><strong>ID:</strong> {project.ID}</p>
                <p><strong>ProjectType:</strong> {project.ProjectType}</p>
                <p><strong>Start Date:</strong> {new Date(project.StartDate).toLocaleDateString()}</p>
                <p><strong>End Date:</strong> {project.EndDate ? new Date(project.EndDate).toLocaleDateString() : undefined}</p>
                <p><strong>ProjectManager:</strong> {project.ProjectManager}</p>
                <p><strong>Status:</strong> {project.Status}</p>
                <p><strong>Comment:</strong> {project.Comment}</p>
            </div>
        </div>
    );
};

export default ProjectModal;
