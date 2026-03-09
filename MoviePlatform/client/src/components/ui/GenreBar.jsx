import React from 'react';

const GenreBar = ({ genres, selectedId, onGenreClick, allText = "All Genres", className = "" }) => (
    <div className={`flex overflow-x-auto gap-3 pb-4 hide-scrollbar ${className}`}>
        <button
            onClick={() => onGenreClick(null)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-lg backdrop-blur-xl border ${selectedId === null ? 'bg-violet-600/20 text-violet-400 border-violet-500/40' : 'bg-white/5 text-textSub/60 border-glassBorder hover:bg-white/10 hover:text-textMain'}`}
        >
            {allText}
        </button>
        {genres.map(genre => (
            <button
                key={genre.id}
                onClick={() => onGenreClick(genre.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-lg backdrop-blur-xl border ${selectedId === genre.id ? 'bg-violet-600/20 text-violet-400 border-violet-500/40' : 'bg-white/5 text-textSub/60 border-glassBorder hover:bg-white/10 hover:text-textMain'}`}
            >
                {genre.name}
            </button>
        ))}
    </div>
);

export default GenreBar;
