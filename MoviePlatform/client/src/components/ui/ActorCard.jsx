import React from 'react';
import { Link } from 'react-router';

const ActorCard = ({ actor }) => (
    <Link to={`/actor/${actor.id}`}>
        <div className="group relative rounded-[2rem] overflow-hidden transition-all duration-[0.6s] cubic-bezier(0.19, 1, 0.22, 1) hover:scale-[1.03] hover:z-10 shadow-lg shadow-black/40 hover:shadow-2xl bg-[#09090b] aspect-[10/14] border border-white/5">
            {actor.profile_path ? (
                <img
                    src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                    alt={actor.name}
                    className="w-full h-full object-cover absolute inset-0 transition-all duration-[0.8s] group-hover:scale-110"
                    loading="lazy"
                />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/50 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md border border-white/10 transition-transform duration-500 group-hover:scale-110">
                        <i className="ri-user-fill text-white/40 text-4xl" />
                    </div>
                </div>
            )}

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-6 border-b-4 border-primary/40 opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-1">
                    <h3 className="text-white font-black text-xl lg:text-2xl drop-shadow-2xl tracking-tighter mb-1 line-clamp-1">{actor.name}</h3>
                    <p className="text-gray-400 font-bold text-[10px] lg:text-xs truncate drop-shadow-lg uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                        {actor.known_for?.map(m => m.title || m.name).join(' • ') || 'Actor / Professional'}
                    </p>
                </div>
            </div>

            {/* Premium Badge */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-full shadow-2xl">
                    <i className="ri-arrow-right-line text-white text-sm" />
                </div>
            </div>
        </div>
    </Link>
);

export default ActorCard;
