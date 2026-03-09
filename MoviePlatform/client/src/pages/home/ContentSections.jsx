import React from 'react';

export const TrendingSection = ({ trending, movieStatus, renderContent }) => (
    <section className="gsap-section glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 tracking-wider flex items-center gap-2">
                <i className="ri-fire-fill text-orange-500"></i> Trending Now
            </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {renderContent(trending.slice(1, 11), true, movieStatus)}
        </div>
    </section>
);

export const PopularMoviesSection = ({ popularMovies, movieStatus, renderContent }) => (
    <section className="gsap-section glass-panel p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 tracking-wider flex items-center gap-2">
                <i className="ri-film-line text-blue-400"></i> Popular Movies
            </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {renderContent(popularMovies, movieStatus === 'idle' || popularMovies.length === 0, movieStatus)}
        </div>
    </section>
);

export const PopularTvSection = ({ popularTvShows, movieStatus, renderContent, loadingMore }) => (
    <section className="gsap-section glass-panel p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 tracking-wider flex items-center gap-2">
                <i className="ri-tv-line text-green-400"></i> Popular TV Shows
            </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {renderContent(popularTvShows, movieStatus === 'idle' || popularTvShows.length === 0, movieStatus)}
        </div>
        {loadingMore && (
            <div className="flex justify-center mt-8 pb-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
            </div>
        )}
    </section>
);

export const GenreResultsSection = ({ selectedGenreId, genres, moviesByGenre, movieStatus, renderContent, loadingMore }) => (
    <section className="gsap-section glass-panel p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold border-l-4 border-primary pl-4 tracking-wider flex items-center gap-2">
                <i className="ri-movie-2-line text-primary"></i> {genres.find(g => g.id === selectedGenreId)?.name} Movies
            </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {renderContent(moviesByGenre[selectedGenreId]?.results || [], !moviesByGenre[selectedGenreId], movieStatus)}
        </div>
        {loadingMore && (
            <div className="flex justify-center mt-8 pb-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg"></div>
            </div>
        )}
    </section>
);
