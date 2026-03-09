import React from 'react';

const ActorBio = ({ actor, isExpanded, onToggle }) => (
    <div className="lg:w-2/3 space-y-12">
        <div className="glass-panel p-10 md:p-14 animate-fade-in shadow-2xl rounded-[2.5rem] border border-white/5">
            <h2 className="text-3xl font-black uppercase tracking-widest mb-10 border-l-4 border-primary pl-6" style={{ color: 'var(--text-main)' }}>The Story</h2>
            <div className="relative group/bio">
                <p className={`text-textMain leading-relaxed text-xl whitespace-pre-line font-medium opacity-90 italic transition-all duration-700 ${!isExpanded ? 'line-clamp-5' : ''}`}>
                    {actor.biography || "No records found for this legend's journey."}
                </p>
                {actor.biography?.length > 400 && (
                    <button
                        onClick={onToggle}
                        className="mt-6 text-primary font-black uppercase tracking-[0.2em] text-sm hover:text-white transition-all flex items-center gap-2 group-hover/bio:translate-x-1"
                    >
                        {isExpanded ? (
                            <><i className="ri-subtract-line text-lg" /> Less is More</>
                        ) : (
                            <><i className="ri-add-line text-lg" /> Discover The Full Legend</>
                        )}
                    </button>
                )}
            </div>
        </div>
    </div>
);

export default ActorBio;
