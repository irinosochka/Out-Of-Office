import React, { useEffect, useState } from 'react';
import ProjectsTable from '../components/Projects/ProjectsTable';
import {IProject} from "../models/IProject";
import {IEmployee} from "../models/IEmployee";
import {deleteProject, getProjects, updateProject} from "../api/ProjectApi";
import {getEmployees} from "../api/EmployeeApi";
import {useRole} from "../context/RoleContext";
import moment from "moment";
import AddProjectForm from "../components/Projects/AddProjectForm";
import ProjectModal from "../components/Projects/ProjectModal";
import UpdateProjectForm from "../components/Projects/UpdateProjectForm";

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [projectManagers, setProjectManagers] = useState<IEmployee[]>([]);
    const [showAddingForm, setShowAddingForm] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
    const [editingProject, setEditingProject] = useState<IProject | null>(null);
    const {selectedRole} = useRole();

    const isPM = () => selectedRole === 'Project Manager';

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await getProjects();
                const projectsWithDates = response.data.map(project => ({
                    ...project,
                    StartDate: new Date(project.StartDate),
                    EndDate: project.EndDate ? new Date(project.EndDate) : undefined,
                }));
                setProjects(projectsWithDates);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        const fetchPMs = async () => {
            try {
                const response = await getEmployees();
                const filteredManagers = response.data.filter(employee =>
                    employee.Subdivision === 'Product Management' && employee.Position === 'Project Manager'
                );
                setProjectManagers(filteredManagers);
            } catch (error) {
                console.error('Error fetching Project Managers:', error);
            }
        };
        fetchPMs();
    }, []);

    const handleAddProject = (project: IProject) => {
        setProjects([...projects, project]);
    };

    const handleCloseAdding = () => {
        setShowAddingForm(false);
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
            <ProjectsTable
                projects={projects}
                isPm={isPM()}
                setShowAddingForm={setShowAddingForm}
                setSelectedProject={setSelectedProject}
                handleEditProject={handleEditProject}
                handleStatusChange={handleStatusChange}
                handleDeleteProject={handleDeleteProject}
            />
            {showAddingForm && (
                <AddProjectForm
                    onSubmit={handleAddProject}
                    onClose={() => handleCloseAdding()}
                />
            )}
            {selectedProject &&
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
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

export default ProjectsPage;
