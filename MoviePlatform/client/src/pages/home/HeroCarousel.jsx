import React from 'react';
import { Link } from 'react-router';
import { HeroSkeleton } from '../../components/ui/Skeleton';

const HeroCarousel = ({ heroMovie, heroFade, heroIndex, heroType, activeHeroPool, goToHero }) => {
    if (!heroMovie) return <HeroSkeleton />;

    return (
        <div className="gsap-hero relative w-full h-[70vh] rounded-3xl overflow-hidden shadow-2xl shadow-black/80 select-none">
            {/* Backdrop image with crossfade */}
            <img
                key={heroMovie.id}
                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
                alt={heroMovie.title || heroMovie.name}
                className="w-full h-full object-cover absolute inset-0"
                style={{
                    opacity: heroFade ? 0.85 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b]/60 via-transparent to-transparent" />

            {/* Content */}
            <div
                className="absolute inset-0 flex items-end"
                style={{
                    opacity: heroFade ? 1 : 0,
                    transition: 'opacity 0.5s ease-in-out',
                }}
            >
                <div className="p-8 md:p-16 w-full md:w-2/3">
                    {/* Genre / rating badge */}
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white">
                            {heroMovie.media_type === 'tv' ? 'TV Show' : 'Movie'}
                        </span>
                        {heroMovie.vote_average > 0 && (
                            <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                                <i className="ri-star-fill"></i> {heroMovie.vote_average?.toFixed(1)}
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 mt-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] text-white leading-[1.1] tracking-tight max-w-[800px]">
                        {heroMovie.title || heroMovie.name}
                    </h1>
                    <p className="text-base md:text-lg text-gray-200 mb-8 drop-shadow-md line-clamp-2 md:line-clamp-3 font-light max-w-xl opacity-90 leading-relaxed">
                        {heroMovie.overview}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to={`/details/${heroType}/${heroMovie.id}`}
                            className="premium-btn text-white flex items-center gap-2 shadow-xl shadow-violet-600/30 hover:shadow-violet-600/50 hover:-translate-y-1 transition-all px-6 py-3 md:px-8 md:py-3.5 text-sm md:text-base font-bold"
                        >
                            <i className="ri-play-fill text-lg md:text-xl"></i> Watch Trailer
                        </Link>
                        <Link
                            to={`/details/${heroType}/${heroMovie.id}`}
                            className="px-6 py-3 md:px-8 md:py-3.5 rounded-full font-bold text-white border border-white/20 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:-translate-y-1 transition-all flex items-center gap-2 shadow-lg text-sm md:text-base"
                        >
                            <i className="ri-information-line text-lg md:text-xl opacity-80"></i> Details
                        </Link>
                    </div>
                </div>
            </div>

            {/* Prev / Next arrow buttons */}
            <button
                onClick={() => goToHero((heroIndex - 1 + activeHeroPool.length) % activeHeroPool.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center transition-all z-10"
            >
                <i className="ri-arrow-left-s-line text-2xl"></i>
            </button>
            <button
                onClick={() => goToHero((heroIndex + 1) % activeHeroPool.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center transition-all z-10"
            >
                <i className="ri-arrow-right-s-line text-2xl"></i>
            </button>
        </div>
    );
};

export default HeroCarousel;
