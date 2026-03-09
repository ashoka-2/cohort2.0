import React from 'react';
import MovieCard from '../../components/ui/MovieCard';

const ActorMovies = ({ movies }) => {
    if (movies.length === 0) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-24">
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-12 flex items-center gap-4" style={{ color: 'var(--text-main)' }}>
                <i className="ri-movie-2-fill text-primary text-4xl" /> Iconic Performances
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 gap-y-12">
                {movies.map(movie => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
};

export default ActorMovies;
