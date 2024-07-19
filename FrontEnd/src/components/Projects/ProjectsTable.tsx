import React, { useState } from 'react';
import { IProject } from "../../models/IProject";
import Search from "../../common/Search";
import '../../styles/tableStyles.scss';
import {sortArray} from "../../utils/utils";
import {useSort} from "../../hooks/useSort";

interface ProjectsTableProps {
    projects: IProject[];
    isPm: boolean;
    setShowAddingForm: (open: boolean) => void;
    setSelectedProject: (project: IProject) => void;
    handleEditProject: (project: IProject) => void;
    handleStatusChange: (project: IProject) => void;
    handleDeleteProject: (project: IProject) => void;

}

const ProjectsTable: React.FC<ProjectsTableProps> = ({
                                                         projects,
                                                         isPm,
                                                         setShowAddingForm,
                                                         setSelectedProject,
                                                         handleEditProject,
                                                         handleDeleteProject,
                                                         handleStatusChange
                                                     }) => {
    const { sortBy, sortAsc, handleSort } = useSort<IProject>('ID');
    const [searchTerm, setSearchTerm] = useState<string>('');

    const filteredProjects = searchTerm
        ? projects.filter(project => project.ID.toString().includes(searchTerm))
        : projects;

    const sorted = sortArray(filteredProjects, sortBy, sortAsc);

    return (
        <>
            <div className="header-container">
                <div className="table-search">
                    <Search value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by id..." />
                </div>
                {isPm && (
                    <button className="btn-add" onClick={() => setShowAddingForm(true)}>
                        <span>+</span> Add
                    </button>
                )}
            </div>

            <div className="table-container">
                <table className="table">
                    <thead>
                    <tr>
                        <SortableHeader column="ID" title="ID" handleSort={handleSort} />
                        <SortableHeader column="ProjectType" title="Project Type" handleSort={handleSort} />
                        <SortableHeader column="StartDate" title="Start Date" handleSort={handleSort} />
                        <SortableHeader column="EndDate" title="End Date" handleSort={handleSort} />
                        <SortableHeader column="ProjectManager" title="Project Manager" handleSort={handleSort} />
                        <SortableHeader column="Status" title="Status" handleSort={handleSort} />
                        <SortableHeader column="Comment" title="Comment" handleSort={handleSort} />
                        {isPm && <th>Actions</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {sorted.map((project, idx) => (
                        <tr
                            key={idx}
                            onClick={() => setSelectedProject(project)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>{project.ID}</td>
                            <td>{project.ProjectType}</td>
                            <td>{new Date(project.StartDate).toLocaleDateString()}</td>
                            <td>{project.EndDate ? new Date(project.EndDate).toLocaleDateString() : undefined}</td>
                            <td>{project.ProjectManager}</td>
                            <td>{project.Status}</td>
                            <td>{project.Comment}</td>
                            {isPm && (
                                <td>
                                    <button
                                        className="btn-edit"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditProject(project);
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={`btn-action ${project.Status === 'Active' ? 'btn-deactivate' : 'btn-activate'}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStatusChange(project);
                                        }}
                                    >
                                        {project.Status === 'Active' ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="btn-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteProject(project);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
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
