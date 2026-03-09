import React from 'react';

const SearchBar = ({ query, onChange, onFocus, onBlur }) => (
    <div className="max-w-3xl mx-auto mb-12 relative group glass-panel p-2 flex items-center shadow-xl">
        <i className="ri-search-line absolute left-6 text-textSub text-xl group-focus-within:text-primary transition"></i>
        <input
            type="text"
            placeholder="Search for movies, TV shows..."
            value={query}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full bg-transparent text-textMain rounded-full py-3 pl-14 pr-6 focus:outline-none transition text-lg tracking-wide placeholder-textSub"
        />
    </div>
);

export default SearchBar;
