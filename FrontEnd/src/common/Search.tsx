import React from 'react';

interface SearchProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const Search: React.FC<SearchProps> = ({ value, onChange, placeholder = 'Search...' }) => {
    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        </div>
    );
};

export default Search;
