import React from 'react';

export const extractYouTubeId = (url = '') => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&\n?#]+)/);
    return match?.[1] || null;
};

const AdminMovieCard = ({ movie, onEdit, onDelete }) => {
    const ytId = extractYouTubeId(movie.trailerUrl);
    return (
        <div className="glass-panel overflow-hidden group hover:-translate-y-2 transition-all duration-500 rounded-[2.5rem] border border-white/5 hover:border-violet-500/30 shadow-xl hover:shadow-violet-500/10">
            <div className="relative aspect-video md:aspect-[16/10] overflow-hidden">
                <img src={movie.posterUrl} alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1s]" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent flex items-end p-5">
                    <span className="text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full bg-violet-600/80 backdrop-blur-md text-white border border-white/10 shadow-lg">
                        {movie.category}
                    </span>
                </div>
                {movie.movieId && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-mono text-gray-300">ID: {movie.movieId}</span>
                    </div>
                )}
            </div>

            <div className="p-6 space-y-4">
                <div>
                    <h3 className="font-extrabold text-lg truncate drop-shadow-md text-white" title={movie.title}>{movie.title}</h3>
                    <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                        <span className="flex items-center gap-1.5"><i className="ri-calendar-event-line text-violet-400" />{movie.releaseDate?.substring(0, 4)}</span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="flex items-center gap-1.5"><i className="ri-price-tag-3-line text-violet-400" />{movie.genre}</span>
                    </div>
                </div>

                <p className="text-xs line-clamp-2 text-gray-400 leading-relaxed italic">{movie.description}</p>

                <div className="flex flex-col gap-3 pt-2">
                    {ytId && (
                        <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20 shadow-lg hover:shadow-red-500/20 active:scale-95">
                            <i className="ri-youtube-line text-lg" /> Watch Preview
                        </a>
                    )}

                    <div className="flex gap-3">
                        <button onClick={() => onEdit(movie)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all neumorph hover:bg-violet-600 hover:text-white text-violet-400 active:scale-95">
                            <i className="ri-edit-2-line" /> Edit
                        </button>
                        <button onClick={() => onDelete(movie._id)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.1em] transition-all bg-white/5 hover:bg-red-600 hover:text-white text-red-400 border border-white/5 active:scale-95">
                            <i className="ri-delete-bin-6-line" /> Trash
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMovieCard;
