import React, { useState } from 'react';
import { getTitleGradient } from './DetailsUtils';

const MediaHero = ({
    media, title, type, releaseDate, runtime, trailer, isFavorite,
    handleFavoriteToggle, isExpanded, setIsExpanded, setIsPlaying
}) => {
    const [imgError, setImgError] = useState({ backdrop: false, poster: false });

    return (
        <div className="relative w-full h-[75vh] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/80 mb-12 border border-white/5">
            {/* Backdrop image or fallback */}
            {media.backdrop_path && !imgError.backdrop ? (
                <img
                    src={media.backdrop_path.startsWith('http') ? media.backdrop_path : `https://image.tmdb.org/t/p/original${media.backdrop_path}`}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(p => ({ ...p, backdrop: true }))}
                />
            ) : (
                <div className={`w-full h-full bg-gradient-to-br ${getTitleGradient(title)} flex items-center justify-center`}>
                    <i className="ri-film-fill text-white/10 text-[15rem]" />
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent flex flex-col justify-end p-5 md:p-16">
                <div className="max-w-6xl flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-end">
                    {/* Poster or fallback card */}
                    <div className="hidden sm:block flex-shrink-0 group">
                        {media.poster_path && !imgError.poster ? (
                            <img
                                src={media.poster_path.startsWith('http') ? media.poster_path : `https://image.tmdb.org/t/p/w500${media.poster_path}`}
                                alt={title}
                                className="w-48 md:w-64 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/10 group-hover:scale-105 transition-transform duration-500"
                                onError={() => setImgError(p => ({ ...p, poster: true }))}
                            />
                        ) : (
                            <div className={`w-48 md:w-64 aspect-[2/3] rounded-2xl bg-gradient-to-br ${getTitleGradient(title)} flex flex-col items-center justify-center p-6 border border-white/10 shadow-2xl`}>
                                <i className="ri-movie-2-fill text-white/40 text-6xl mb-4" />
                                <span className="text-white font-bold text-lg text-center leading-tight drop-shadow">{title}</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 animate-slide-up w-full">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] text-white tracking-tight leading-tight">
                            {title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm mb-8 font-bold drop-shadow">
                            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white uppercase tracking-wider">
                                {type === 'tv' ? 'TV Series' : 'Movie'}
                            </span>
                            {releaseDate && (
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white">
                                    {releaseDate.substring(0, 4)}
                                </span>
                            )}
                            {runtime && (
                                <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white">
                                    {runtime} min
                                </span>
                            )}
                            <span className="flex items-center gap-1.5 text-yellow-400 text-lg">
                                <i className="ri-star-fill shadow-yellow-500/50"></i> {media.vote_average?.toFixed(1)}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3 md:gap-4 mb-8">
                            <button
                                onClick={() => setIsPlaying(true)}
                                disabled={!trailer}
                                className={`px-5 py-2.5 md:px-8 md:py-3.5 rounded-full font-extrabold flex items-center gap-2 md:gap-3 transition-all shadow-xl text-sm md:text-base
                                    ${trailer
                                        ? 'premium-btn text-white hover:scale-105 active:scale-95'
                                        : 'bg-white/5 text-white/40 border border-white/5 cursor-not-allowed'}`}
                            >
                                <i className="ri-play-fill text-xl md:text-2xl"></i>
                                {trailer ? 'Watch Trailer' : 'Trailer N/A'}
                            </button>

                            <button
                                onClick={handleFavoriteToggle}
                                className="px-5 py-2.5 md:px-8 md:py-3.5 rounded-full font-extrabold flex items-center gap-2 md:gap-3 transition-all neumorph hover:scale-105 active:scale-95 text-sm md:text-base whitespace-nowrap"
                                style={{ color: isFavorite ? 'var(--primary)' : 'var(--text-sub)' }}
                            >
                                {isFavorite ? <i className="ri-heart-3-fill text-xl md:text-2xl text-primary" /> : <i className="ri-heart-3-line text-xl md:text-2xl" />}
                                {isFavorite ? 'Saved' : 'Add to Collection'}
                            </button>
                        </div>

                        <div className="relative group/desc max-w-3xl">
                            <p className={`text-lg md:text-xl text-gray-200 leading-relaxed font-medium drop-shadow transition-all duration-500 ${!isExpanded ? 'line-clamp-3 md:line-clamp-4' : ''}`}>
                                {media.overview}
                            </p>
                            {media.overview?.length > 200 && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="mt-2 text-primary font-bold hover:text-white transition-colors flex items-center gap-1 text-sm bg-white/5 px-3 py-1 rounded-full border border-white/5 hover:bg-white/10"
                                >
                                    {isExpanded ? (
                                        <><i className="ri-subtract-line" /> Show Less</>
                                    ) : (
                                        <><i className="ri-add-line" /> Read Full Story</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaHero;
