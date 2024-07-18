export const sortArray = <T>(
    array: T[],
    sortBy: keyof T,
    sortAsc: boolean
): T[] => {
    return [...array].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return sortAsc ? aValue - bValue : bValue - aValue;
        } else if (aValue instanceof Date && bValue instanceof Date) {
            return sortAsc ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime();
        } else {
            return 0;
        }
    });
};
