import React from 'react';
import MovieCard from '../../components/ui/MovieCard';

const RecommendationsSection = ({ recommendations, type }) => {
    if (recommendations.length === 0) return null;

    return (
        <section className="container mx-auto px-4 mt-12 glass-panel p-5 md:p-8">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                <i className="ri-thumb-up-fill text-primary text-2xl md:text-3xl" /> Related {type === 'tv' ? 'Series' : 'Movies'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
                {recommendations.map(rec => (
                    <MovieCard key={rec.id} movie={{ ...rec, media_type: type }} />
                ))}
            </div>
        </section>
    );
};

export default RecommendationsSection;
