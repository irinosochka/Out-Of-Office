import { useState } from 'react';

export const useSort = <T>(defaultSortBy: keyof T) => {
    const [sortBy, setSortBy] = useState<keyof T>(defaultSortBy);
    const [sortAsc, setSortAsc] = useState<boolean>(true);

    const handleSort = (column: keyof T) => {
        if (sortBy === column) {
            setSortAsc(!sortAsc);
        } else {
            setSortBy(column);
            setSortAsc(true);
        }
    };

    return { sortBy, sortAsc, handleSort };
};
