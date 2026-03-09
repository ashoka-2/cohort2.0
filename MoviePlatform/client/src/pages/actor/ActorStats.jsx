import React from 'react';

const ActorStats = ({ actor }) => (
    <div className="lg:w-1/3 space-y-8">
        <div className="glass-panel p-10 animate-fade-in shadow-2xl border border-white/5 rounded-[2.5rem]">
            <h2 className="text-2xl font-black uppercase tracking-widest mb-8 border-l-4 border-primary pl-4" style={{ color: 'var(--text-main)' }}>Personal Stats</h2>
            <div className="space-y-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-primary uppercase tracking-[0.2em] text-xs font-black block mb-2">Birthday</span>
                    <span className="text-xl text-textMain font-bold">{actor.birthday || 'Legacy Data'}</span>
                </div>
                {actor.deathday && (
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <span className="text-red-400 uppercase tracking-[0.2em] text-xs font-black block mb-2">Died</span>
                        <span className="text-xl text-textMain font-bold">{actor.deathday}</span>
                    </div>
                )}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-primary uppercase tracking-[0.2em] text-xs font-black block mb-2">Place of Birth</span>
                    <span className="text-lg text-textMain font-bold leading-tight">{actor.place_of_birth || 'Earth'}</span>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-primary uppercase tracking-[0.2em] text-xs font-black block mb-2">Gender</span>
                    <span className="text-lg text-textMain font-bold">{actor.gender === 1 ? 'Female' : actor.gender === 2 ? 'Male' : 'Non-Binary'}</span>
                </div>
            </div>
        </div>
    </div>
);

export default ActorStats;
