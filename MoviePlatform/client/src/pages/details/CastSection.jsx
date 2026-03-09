import React from 'react';
import { Link } from 'react-router';

const CastSection = ({ cast }) => {
    if (cast.length === 0) return null;

    return (
        <section className="container mx-auto px-4 mt-12 glass-panel p-5 md:p-8">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest mb-6 flex items-center gap-3" style={{ color: 'var(--text-main)' }}>
                <i className="ri-group-fill text-primary text-2xl md:text-3xl" /> Top Billed Cast
            </h2>
            <div className="flex overflow-x-auto gap-5 md:gap-8 pb-4 hide-scrollbar">
                {cast.map(actor => (
                    <Link to={`/actor/${actor.id}`} key={actor.id} className="block shrink-0 w-[140px] md:w-[170px] group">
                        <div className="h-full flex flex-col">
                            <div className="aspect-[2/3] w-full rounded-2xl overflow-hidden mb-4 shadow-xl border border-white/5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-primary/20 relative bg-background">
                                {actor.profile_path ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                                        alt={actor.name}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900 to-fuchsia-900 flex flex-col items-center justify-center p-4">
                                        <i className="ri-user-fill text-white/20 text-6xl mb-2" />
                                        <span className="text-white font-bold text-xs text-center line-clamp-2 px-2 opacity-80">{actor.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="text-center px-1">
                                <h3 className="font-bold text-sm truncate" style={{ color: 'var(--text-main)' }}>{actor.name}</h3>
                                <p className="text-xs font-semibold mt-1 truncate" style={{ color: 'var(--text-sub)' }}>{actor.character}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default CastSection;
