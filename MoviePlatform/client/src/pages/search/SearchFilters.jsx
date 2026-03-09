import React from 'react';

const SearchFilters = ({ searchType, onTypeChange }) => (
    <div className="flex flex-wrap justify-center gap-3 md:gap-6 mb-8 md:mb-12">
        <button
            onClick={() => onTypeChange('movies')}
            className={`px-5 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm md:text-base ${searchType === 'movies' ? 'premium-btn text-white' : 'neumorph text-textSub hover:text-primary'}`}
        >
            <i className="ri-movie-2-line"></i> Movies & TV
        </button>
        <button
            onClick={() => onTypeChange('actors')}
            className={`px-5 md:px-8 py-2.5 md:py-3 rounded-full font-bold transition-all flex items-center gap-2 text-sm md:text-base ${searchType === 'actors' ? 'premium-btn text-white' : 'neumorph text-textSub hover:text-primary'}`}
        >
            <i className="ri-user-star-line"></i> Actors
        </button>
    </div>
);

export default SearchFilters;
