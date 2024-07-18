import React, { useState } from 'react';
import {IProject} from "../../models/IProject";
import {deleteProject, updateProject} from "../../api/ProjectApi";
import {useRole} from "../../context/RoleContext";
import moment from "moment";
import UpdateProjectForm from "./UpdateProjectForm";
import ProjectModal from "./ProjectModal";

interface ProjectsTableProps {
    projects: IProject[];
    setProjects: React.Dispatch<React.SetStateAction<IProject[]>>;
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects , setProjects}) => {
    const [sortBy, setSortBy] = useState<keyof IProject>('ID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const [editingProject, setEditingProject] = useState<IProject | null>(null);
    const { selectedRole } = useRole();

    const handleSort = (column: keyof IProject) => {
        if (sortBy === column) {
            // If clicking on the same column, reverse the sort order
            setSortAsc(!sortAsc);
        } else {
            // If clicking on a different column, set the new column for sorting
            setSortBy(column);
            setSortAsc(true); // Default to ascending order for the new column
        }
    };


    const sorted = [...projects].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            if (sortAsc) {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (sortAsc) {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        } else {
            return 0; // if aValue or bValue is undefined
        }
    });

    const handleCloseModal = () => {
        setSelectedProject(null);
    };

    const handleDeleteProject = async (deletedProject: IProject) => {
        try{
            const deleteResponse = await deleteProject(deletedProject.ID)
            if (deleteResponse.status === 200) {
                setProjects((prevProjects) =>
                    prevProjects.filter((proj) => proj.ID !== deletedProject.ID)
                );
                console.log("Employee deleted:", deletedProject);
            } else {
                console.error("Failed to delete employee, status:", deleteResponse.status);
            }
        }catch (error) {
            console.error("Failed to delete project:", error);
        }
    }

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
            console.log('Updating project with payload:', formattedProject);
            const response = await updateProject(formattedProject);
            if (response.status === 200) {
                setProjects((prevProjects) =>
                    prevProjects.map((proj) => (proj.ID === updatedProject.ID ? updatedProject : proj))
                );
                console.log("Project updated:", response.data);
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
        <div>
            <table>
                <thead>
                <tr>
                    <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                    <SortableHeader column="ProjectType" title="ProjectType" handleSort={handleSort} />
                    <SortableHeader column="StartDate" title="StartDate" handleSort={handleSort} />
                    <SortableHeader column="EndDate" title="EndDate" handleSort={handleSort} />
                    <SortableHeader column="ProjectManager" title="ProjectManager" handleSort={handleSort} />
                    <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                    <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
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
                        {
                            selectedRole === 'Project Manager' &&
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
            {selectedProject &&
                <ProjectModal
                    project={selectedProject}
                    onClose={handleCloseModal}
                />
            }
            {editingProject && (
                <UpdateProjectForm
                    project={editingProject}
                    onSubmit={handleUpdateProject}
                    onClose={() => setEditingProject(null)}
                />
            )}
        </div>
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
