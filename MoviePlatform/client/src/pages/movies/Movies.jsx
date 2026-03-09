import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPopularMovies, fetchGenres, fetchMoviesByGenre } from '../../features/movies/movieSlice';
import MovieCard from '../../components/ui/MovieCard';
import Skeleton from '../../components/ui/Skeleton';
import gsap from 'gsap';
import SectionHeader from '../../components/ui/SectionHeader';
import GenreBar from '../../components/ui/GenreBar';

const Movies = () => {
    const dispatch = useDispatch();
    const { popularMovies, status, popularPage, genres, moviesByGenre } = useSelector((state) => state.movies);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const containerRef = useRef(null);

    const items = selectedGenreId ? (moviesByGenre[selectedGenreId]?.results || []) : popularMovies;

    // Initial load
    useEffect(() => {
        if (popularMovies.length === 0) dispatch(fetchPopularMovies(1));
        if (genres.length === 0) dispatch(fetchGenres());
    }, [dispatch, popularMovies.length, genres.length]);

    // Animation
    useEffect(() => {
        if (items.length > 0 && containerRef.current) {
            const ctx = gsap.context(() => {
                const titles = gsap.utils.toArray('.gsap-movies-title:not(.animated)');
                if (titles.length > 0) {
                    titles.forEach(t => t.classList.add('animated'));
                    gsap.from(titles, { opacity: 0, x: -50, duration: 0.8, ease: 'power3.out' });
                }

                const cards = gsap.utils.toArray('.gsap-movies-card:not(.animated)');
                if (cards.length > 0) {
                    cards.forEach(c => c.classList.add('animated'));
                    gsap.from(cards, { opacity: 0, y: 30, duration: 0.5, stagger: 0.04, ease: 'power2.out', delay: 0.2 });
                }
            }, containerRef);
            return () => ctx.revert();
        }
    }, [items]);

    const handleScroll = useCallback(() => {
        const nearBottom = window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 200;
        if (nearBottom && !loadingMore && status !== 'loading') {
            if (selectedGenreId) {
                const currentGenrePage = moviesByGenre[selectedGenreId]?.page || 1;
                if (currentGenrePage < 500) {
                    setLoadingMore(true);
                    dispatch(fetchMoviesByGenre({ genreId: selectedGenreId, page: currentGenrePage + 1 })).finally(() => {
                        setTimeout(() => setLoadingMore(false), 500);
                    });
                }
            } else {
                if (popularPage < 500) {
                    setLoadingMore(true);
                    dispatch(fetchPopularMovies(popularPage + 1)).finally(() => {
                        setTimeout(() => setLoadingMore(false), 500);
                    });
                }
            }
        }
    }, [dispatch, loadingMore, popularPage, status, selectedGenreId, moviesByGenre]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleGenreClick = (genreId) => {
        if (selectedGenreId === genreId) {
            setSelectedGenreId(null);
        } else {
            setSelectedGenreId(genreId);
            if (!moviesByGenre[genreId]) {
                dispatch(fetchMoviesByGenre({ genreId, page: 1 }));
            }
        }
    };

    const renderContent = () => {
        const isLoading = selectedGenreId ? !moviesByGenre[selectedGenreId] : popularMovies.length === 0;
        if (isLoading) {
            return Array(20).fill(0).map((_, i) => <Skeleton key={i} />);
        }
        return items.map((movie) => (
            <div key={movie.id || movie._id} className="gsap-movies-card">
                <MovieCard movie={movie} />
            </div>
        ));
    };

    return (
        <div className="space-y-8 pb-12" ref={containerRef}>
            <SectionHeader
                title="Discover"
                highlight="Movies"
                badge1="Discover"
                badge2="Popular"
                className="gsap-movies-title"
            />
            <GenreBar genres={genres} selectedId={selectedGenreId} onGenreClick={handleGenreClick} />

            <div className="glass-panel p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {renderContent()}
                    {loadingMore && Array(5).fill(0).map((_, i) => <Skeleton key={`more-${i}`} />)}
                </div>

                {loadingMore && (
                    <div className="flex justify-center mt-8 pb-4">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-lg shadow-primary/40"></div>
                            <span className="text-textSub text-sm font-medium">Loading more movies…</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;
