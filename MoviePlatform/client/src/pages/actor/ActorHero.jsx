import React from 'react';

const ActorHero = ({ actor, backdrop, profileUrl }) => (
    <div className="relative w-full h-[60vh] rounded-b-[3rem] overflow-hidden shadow-2xl shadow-black/80 mb-12 -mt-8 md:-mt-12 group border-b border-white/10">
        {backdrop ? (
            <img src={backdrop} alt="Backdrop" className="w-full h-full object-cover opacity-60 absolute inset-0 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000" />
        ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#09090b] via-indigo-950 to-[#09090b] absolute inset-0"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent"></div>

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex flex-col md:flex-row gap-8 items-end z-10 max-w-7xl mx-auto">
            <div className="w-48 md:w-64 shrink-0 translate-y-20 md:translate-y-28 z-20">
                {profileUrl ? (
                    <img
                        src={profileUrl}
                        alt={actor.name}
                        className="w-full rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] object-cover aspect-[2/3] border-4 border-[#09090b] hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full aspect-[2/3] rounded-2xl bg-gradient-to-br from-indigo-900 to-fuchsia-900 border-4 border-[#09090b] flex flex-col items-center justify-center p-6 text-center shadow-2xl">
                        <i className="ri-user-star-fill text-white/30 text-8xl mb-4" />
                        <span className="text-white font-black text-xl drop-shadow-xl">{actor.name}</span>
                    </div>
                )}
            </div>
            <div className="flex-1 pb-4 md:pb-0 text-white animate-slide-up">
                <h1 className="text-5xl md:text-8xl font-black mb-4 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] tracking-tighter">
                    {actor.name}
                </h1>
                <p className="text-2xl text-primary font-black tracking-[0.3em] uppercase drop-shadow-lg opacity-90">
                    {actor.known_for_department}
                </p>
            </div>
        </div>
    </div>
);

export default ActorHero;
