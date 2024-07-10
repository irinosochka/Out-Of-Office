import React, { useState } from 'react';
import {IProject} from "../../models/IProjects";

interface ProjectsTableProps {
    projects: IProject[];
}

const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects }) => {
    const [sortBy, setSortBy] = useState<keyof IProject>('ID');
    const [sortAsc, setSortAsc] = useState<boolean>(true);

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
                    <tr key={idx}>
                        <td>{project.ID}</td>
                        <td>{project.ProjectType}</td>
                        <td>{new Date(project.StartDate).toLocaleDateString()}</td>
                        <td>{project.EndDate ? new Date(project.EndDate).toLocaleDateString() : undefined}</td>
                        <td>{project.ProjectManager}</td>
                        <td>{project.Status}</td>
                        <td>{project.Comment}</td>
                    </tr>
                ))}
                </tbody>
            </table>
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
