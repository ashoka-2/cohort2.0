import React from 'react';

const RecentSearches = ({ queries, onQueryClick, visible }) => {
    if (!visible || queries.length === 0) return null;

    return (
        <div className="max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
            <p className="text-xs font-bold uppercase tracking-widest text-textSub mb-4 px-2">Recently Searched</p>
            <div className="flex flex-wrap gap-2">
                {queries.map((q, idx) => (
                    <button
                        key={idx}
                        onClick={() => onQueryClick(q)}
                        className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all text-sm font-medium flex items-center gap-2 group"
                    >
                        <i className="ri-history-line text-textSub group-hover:text-primary"></i>
                        {q}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default RecentSearches;
