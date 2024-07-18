import React, { useState } from 'react';
import { IProject } from "../../models/IProject";
import { deleteProject, updateProject } from "../../api/ProjectApi";
import moment from "moment";
import UpdateProjectForm from "./UpdateProjectForm";
import ProjectModal from "./ProjectModal";
import { IEmployee } from "../../models/IEmployee";
import Search from "../../common/Search";
import '../../styles/tableStyles.scss';
import Modal from "../../common/Modal";
import AddProjectForm from "./AddProjectForm";
import {useRole} from "../../context/RoleContext";

interface ProjectsTableProps {
    projects: IProject[];
    setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
    projectManagers: IEmployee[];
    isModalOpen: boolean;
    setIsModalOpen: (open: boolean) => void;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
                                                         projects,
                                                         setProjects,
                                                         projectManagers,
                                                         isModalOpen,
                                                         setIsModalOpen
                                                     }) => {
    const [sortBy, setSortBy] = useState<keyof IProject>('ID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const [editingProject, setEditingProject] = useState<IProject | null>(null);
    const {selectedRole} = useRole();

    const handleAddProject = (project: IProject) => {
        setProjects([...projects, project]);
    };

    const filteredProjects = searchTerm
        ? projects.filter(project => project.ID.toString().includes(searchTerm))
        : projects;

    const handleSort = (column: keyof IProject) => {
        if (sortBy === column) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(column);
            setSortAsc(true);
        }
    };

    const sorted = [...filteredProjects].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortAsc ? aValue - bValue : bValue - aValue;
        } else {
            return 0;
        }
    });

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    const handleDeleteProject = async (deletedProject: IProject) => {
        try {
            const deleteResponse = await deleteProject(deletedProject.ID);
            if (deleteResponse.status === 200) {
                setProjects((prevProjects) =>
                    prevProjects.filter((proj) => proj.ID !== deletedProject.ID)
                );
            } else {
                console.error("Failed to delete project, status:", deleteResponse.status);
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
        }
    };

    const handleEditProject = (project: IProject) => {
        setEditingProject(project);
    };

    const handleUpdateProject = async (updatedProject: IProject) => {
        const formattedProject = {
            ...updatedProject,
            StartDate: moment(updatedProject.StartDate).format('YYYY-MM-DD'),
            EndDate: updatedProject.EndDate ? moment(updatedProject.EndDate).format('YYYY-MM-DD') : null,
        };

        try {
            const response = await updateProject(formattedProject);
            if (response.status === 200) {
                setProjects((prevProjects) =>
                    prevProjects.map((proj) => (proj.ID === updatedProject.ID ? updatedProject : proj))
                );
            } else {
                console.error("Failed to update project, status:", response.status);
            }
        } catch (error) {
            console.error("Failed to update project:", error);
        }
        setEditingProject(null);
    };

    const handleStatusChange = async (project: IProject) => {
        const updatedStatus: 'Active' | 'Inactive' = project.Status === 'Active' ? 'Inactive' : 'Active';
        const updatedProject: IProject = { ...project, Status: updatedStatus };
        await handleUpdateProject(updatedProject);
    };

    return (
        <>
            <div className="header-container">
                <div className="table-search">
                    <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by id..." />
                </div>
                {
                    selectedRole === 'Project Manager' &&
                    <button className="table-actions" onClick={() => setIsModalOpen(true)}>
                        <span>+</span> Add
                    </button>
                }
            </div>
            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                        <SortableHeader column="ProjectType" title="ProjectType" handleSort={handleSort} />
                        <SortableHeader column="StartDate" title="StartDate" handleSort={handleSort} />
                        <SortableHeader column="EndDate" title="EndDate" handleSort={handleSort} />
                        <SortableHeader column="ProjectManager" title="ProjectManager" handleSort={handleSort} />
                        <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                        <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                        {selectedRole === 'Project Manager' && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sorted.map((project, idx) => (
                        <tr key={idx} onClick={() => setSelectedProject(project)} style={{ cursor: 'pointer' }}>
                            <td>{project.ID}</td>
                            <td>{project.ProjectType}</td>
                            <td>{new Date(project.StartDate).toLocaleDateString()}</td>
                            <td>{project.EndDate ? new Date(project.EndDate).toLocaleDateString() : undefined}</td>
                            <td>{project.ProjectManager}</td>
                            <td>{project.Status}</td>
                            <td>{project.Comment}</td>
                            {selectedRole === 'Project Manager' &&
                                <td>
                                    <button onClick={(e) => { e.stopPropagation(); handleEditProject(project); }}>Edit</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleStatusChange(project); }}>
                                        {project.Status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDeleteProject(project); }}>Delete</button>
                                </td>
                            }
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <AddProjectForm
                    onSubmit={handleAddProject}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
            {selectedProject &&
                <ProjectModal
                    project={selectedProject}
                    onClose={handleCloseModal}
                    projectManagers={projectManagers}
                />
            }
            {editingProject && (
                <UpdateProjectForm
                    project={editingProject}
                    onSubmit={handleUpdateProject}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </>
    );
};

interface SortableHeaderProps {
    column: keyof IProject;
    title: string;
    handleSort: (column: keyof IProject) => void;
}

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, title, handleSort }) => {
    return (
        <th onClick={() => handleSort(column)} style={{ cursor: 'pointer' }}>
            {title}
        </th>
    );
};

export default ProjectsTable;
