import React, { useEffect, useState } from 'react';
import ProjectsTable from '../components/Projects/ProjectsTable';
import {IProject} from "../models/IProject";
import {IEmployee} from "../models/IEmployee";
import {getProjects} from "../api/ProjectApi";
import {getEmployees} from "../api/EmployeeApi";

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [projectManagers, setProjectManagers] = useState<IEmployee[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

    return (
        <ProjectsTable
            projects={projects}
            setProjects={setProjects}
            projectManagers={projectManagers}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
        />
    );
};

export default ProjectsPage;
