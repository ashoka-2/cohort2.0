import React from 'react';
import MovieCard from '../../components/ui/MovieCard';
import Skeleton from '../../components/ui/Skeleton';

const MoodResults = ({ mood, movies, isFetchingMovies, hasMore }) => {
    if (!mood) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-black tracking-tight" style={{ color: 'var(--text-main)' }}>
                    Top Picks for You
                </h2>
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-textSub">
                    {movies.length} Results
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {movies.map((movie, idx) => (
                    <div key={`${movie.id}-${idx}`} className="animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${(idx % 10) * 50}ms` }}>
                        <MovieCard movie={movie} />
                    </div>
                ))}

                {/* Skeletons while fetching */}
                {isFetchingMovies && Array(10).fill(0).map((_, i) => (
                    <div key={`skel-${i}`} className="animate-in fade-in">
                        <Skeleton />
                    </div>
                ))}
            </div>

            {!hasMore && movies.length > 0 && (
                <div className="text-center py-10 opacity-50 font-medium" style={{ color: 'var(--text-sub)' }}>
                    You've reached the end of the recommendations.
                </div>
            )}

            {isFetchingMovies && movies.length > 0 && (
                <div className="flex justify-center mt-8 pb-8">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/40"></div>
                </div>
            )}
        </div>
    );
};

export default MoodResults;
