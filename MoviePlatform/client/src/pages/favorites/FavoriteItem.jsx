import React from 'react';
import MovieCard from '../../components/ui/MovieCard';

const FavoriteItem = ({ movie, onRemove }) => (
    <div className="relative group">
        <MovieCard movie={movie} />
        <button
            onClick={(e) => {
                e.preventDefault();
                onRemove(movie.id);
            }}
            title="Remove from favorites"
            className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center rounded-full
                bg-red-600/80 hover:bg-red-600 text-white
                opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100
                transition-all duration-200 shadow-lg z-20"
        >
            <i className="ri-delete-bin-fill text-sm"></i>
        </button>
    </div>
);

export default FavoriteItem;
