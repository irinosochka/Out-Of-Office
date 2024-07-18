import React, { useEffect, useState } from 'react';
import { IProject } from '../models/IProjects';
import ProjectsTable from '../components/Projects/ProjectsTable';
import Modal from '../common/Modal';
import AddProjectForm from '../components/Projects/AddProjectForm';
import {getProjects} from "../api/ProjectApi";
import {useRole} from "../context/RoleContext";

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const { selectedRole } = useRole();

    const handleAddProject = (project: IProject) => {
        setProjects([...projects, project]);
    };

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

    return (
        <div>
            <h2>Projects Table</h2>
            {
                selectedRole === 'Project Manager' &&
                <>
                    <button onClick={() => setIsModalOpen(true)}>Add Project</button>
                    <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                        <AddProjectForm
                            onSubmit={handleAddProject}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </Modal>
                </>
            }
            <ProjectsTable projects={projects} setProjects={setProjects}/>
        </div>
    );
};

export default ProjectsPage;
