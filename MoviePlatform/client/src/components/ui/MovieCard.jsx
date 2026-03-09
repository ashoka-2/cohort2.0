import React, { useState, useRef } from 'react';
import { Link } from 'react-router';
import { tmdbService } from '../../services/api/tmdb.service';

// Deterministic gradient based on title string so each movie gets a consistent colour
const getTitleGradient = (title = '') => {
    const gradients = [
        'from-violet-600 to-fuchsia-700',
        'from-blue-600 to-cyan-700',
        'from-rose-600 to-pink-700',
        'from-amber-500 to-orange-700',
        'from-emerald-600 to-teal-700',
        'from-indigo-600 to-blue-800',
        'from-red-600 to-rose-800',
        'from-green-600 to-emerald-800',
    ];
    const idx = title.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
    return gradients[idx];
};

const MovieCard = ({ movie }) => {
    const [trailerKey, setTrailerKey] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);
    const [trailerLoading, setTrailerLoading] = useState(false);
    const [imgError, setImgError] = useState(false);
    const hoverTimeoutRef = useRef(null);

    const title = movie.title || movie.name || 'Unknown';

    // Build poster URL — TMDB path handles either full URL or partial path
    const posterSrc = !imgError && (
        movie.poster_path
            ? (movie.poster_path.startsWith('http') ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`)
            : (movie.posterUrl || null)
    );

    // Dynamic type detection (TMDB often omits media_type in list results)
    const type = movie.media_type || (movie.category?.toLowerCase().includes('tv') || movie.first_air_date || movie.name ? 'tv' : 'movie');

    // Navigate to media details — both movies and TV now use the unified details route
    const actualId = movie.id || movie._id;
    const detailUrl = actualId ? `/details/${type}/${actualId}` : null;

    const handleMouseEnter = () => {
        setIsHovering(true);
        hoverTimeoutRef.current = setTimeout(async () => {
            // Only show trailer if we actually have a way to get one
            if (!trailerKey) {
                setTrailerLoading(true);
                if (movie.id) {
                    try {
                        const mType = movie.media_type === 'tv' ? 'tv' : 'movie';
                        const data = await tmdbService.getMediaVideos(movie.id, mType);
                        const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                        if (trailer) {
                            setTrailerKey(trailer.key);
                            setShowTrailer(true);
                        }
                    } catch { /* fail silently */ }
                    finally { setTrailerLoading(false); }
                } else if (movie.trailerUrl) {
                    const url = movie.trailerUrl;
                    let vidId = '';
                    if (url.includes('v=')) vidId = url.split('v=')[1]?.split('&')[0];
                    else if (url.includes('youtu.be/')) vidId = url.split('youtu.be/')[1]?.split('?')[0];
                    else if (url.includes('shorts/')) vidId = url.split('shorts/')[1]?.split('?')[0];
                    else if (url.includes('embed/')) vidId = url.split('embed/')[1]?.split('?')[0];

                    if (vidId) {
                        setTrailerKey(vidId);
                        setShowTrailer(true);
                    }
                    setTrailerLoading(false);
                }
            } else {
                setShowTrailer(true);
            }
        }, 1200);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
        setShowTrailer(false);
        clearTimeout(hoverTimeoutRef.current);
    };

    const cardContent = (
        <div
            className={`group relative rounded-[2rem] overflow-hidden cursor-pointer transition-all duration-[0.6s] cubic-bezier(0.19, 1, 0.22, 1) hover:scale-[1.03] hover:z-20 shadow-lg shadow-black/40 hover:shadow-2xl aspect-[10/14] ${showTrailer ? 'ring-2 ring-violet-500/50 shadow-violet-500/20' : 'hover:shadow-violet-500/10'}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="w-full h-full relative">
                {/* Trailer Container */}
                <div className={`absolute inset-0 z-0 transition-opacity duration-700 ${showTrailer && trailerKey ? 'opacity-100' : 'opacity-0'}`}>
                    {showTrailer && trailerKey && (
                        <>
                            <iframe
                                className="w-full h-full object-cover pointer-events-none scale-[1.3] brightness-[0.8]"
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${trailerKey}`}
                                title="Trailer"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                            />
                            {/* Vignette Overlay for cinematic look */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-[#09090b]/40 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.6)]"></div>

                            {/* Mute Indicator */}
                            <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 flex items-center gap-2">
                                <i className="ri-volume-mute-fill text-white/80 text-xs"></i>
                                <span className="text-[10px] font-black text-white/60 tracking-tighter uppercase">Preview Only</span>
                            </div>
                        </>
                    )}
                </div>

                {/* Loading State Overlay */}
                {trailerLoading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="w-10 h-10 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin shadow-lg shadow-violet-500/40"></div>
                        <span className="mt-4 text-[10px] font-black text-violet-400 tracking-[0.2em] uppercase">Loading Preview</span>
                    </div>
                )}

                {/* Poster image or coloured fallback */}
                {posterSrc ? (
                    <img
                        src={posterSrc}
                        alt={title}
                        className={`w-full h-full object-cover absolute inset-0 transition-all duration-[0.8s] ease-out group-hover:scale-110 ${showTrailer && trailerKey ? 'opacity-0 scale-125' : 'opacity-100 scale-100'}`}
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    /* ── Coloured placeholder ── */
                    <div className={`w-full h-full absolute inset-0 bg-gradient-to-br transition-all duration-[0.8s] ease-out ${showTrailer && trailerKey ? 'opacity-0 scale-125' : 'opacity-100 scale-100'} ${getTitleGradient(title)} flex flex-col items-center justify-center p-6`}>
                        <i className="ri-movie-2-fill text-white/40 text-7xl mb-4" />
                        <span className="text-white font-bold text-center leading-squash line-clamp-3 text-xl tracking-tight drop-shadow-lg">
                            {title}
                        </span>
                    </div>
                )}

                {/* Hover overlay (Hidden when trailer is active) */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/50 to-transparent flex flex-col justify-end p-6 transition-all duration-500 ${showTrailer && trailerKey ? 'opacity-0 translate-y-4' : 'opacity-0 group-hover:opacity-100 translate-y-0'}`}>
                    <h3 className="text-white font-black text-xl mb-2 drop-shadow-xl line-clamp-2 transition-transform duration-500 tracking-tight">{title}</h3>
                    <div className="flex items-center justify-between transition-transform duration-500 delay-150">
                        <span className="text-white/70 font-bold text-sm bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">{movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || movie.releaseDate?.substring(0, 4) || 'TBA'}</span>
                        {movie.vote_average > 0 && (
                            <span className="text-white font-bold flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
                                <i className="ri-star-fill text-amber-400"></i> {movie.vote_average?.toFixed(1)}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Wrap in Link only if we have a valid TMDB id to link to
    return detailUrl
        ? <Link to={detailUrl}>{cardContent}</Link>
        : cardContent;
};

export default MovieCard;
