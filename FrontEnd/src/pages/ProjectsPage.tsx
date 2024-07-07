import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {IProject} from "../models/IProjects";
import ProjectsTable from "../components/ProjectsTable";

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<IProject[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get<IProject[]>('http://localhost:8082/Lists/Projects');
                console.log(response.data); // Check the structure and contents
                setProjects(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <div>
            <h2>Projects Table</h2>
            <ProjectsTable projects={projects} />
        </div>
    );
};

export default ProjectsPage;
