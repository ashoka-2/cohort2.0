import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchPopularMovies, fetchPopularTvShows, fetchGenres, fetchMoviesByGenre } from '../../features/movies/movieSlice';
import { fetchWatchHistory } from '../../features/movies/historySlice';
import { tmdbService } from '../../services/api/tmdb.service';
import MovieCard from '../../components/ui/MovieCard';
import Skeleton from '../../components/ui/Skeleton';
import gsap from 'gsap';

// Internal Components
import HeroCarousel from './HeroCarousel';
import HistorySection from './HistorySection';
import GenreFilter from './GenreFilter';
import AttributionFooter from '../../components/ui/AttributionFooter';
import {
    TrendingSection,
    PopularMoviesSection,
    PopularTvSection,
    GenreResultsSection
} from './ContentSections';

const Home = () => {
    const dispatch = useDispatch();
    const { trending, popularMovies, popularTvShows, genres, moviesByGenre, status: movieStatus, popularPage, tvPage } = useSelector((state) => state.movies);
    const { items: historyItems, status: historyStatus } = useSelector((state) => state.history);
    const [loadingMore, setLoadingMore] = useState(false);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const [heroPool, setHeroPool] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);
    const [heroFade, setHeroFade] = useState(true);
    const homeRef = useRef(null);
    const heroTimerRef = useRef(null);

    useEffect(() => {
        if (movieStatus === 'idle') {
            dispatch(fetchTrending());
            dispatch(fetchPopularMovies(1));
            dispatch(fetchPopularTvShows(1));
            dispatch(fetchGenres());
        }
    }, [dispatch, movieStatus]);

    useEffect(() => {
        tmdbService.getRandomHeroMovies().then(movies => {
            setHeroPool(movies);
            setHeroIndex(Math.floor(Math.random() * movies.length));
        }).catch(() => {
            setHeroPool(trending.slice(0, 15));
        });
    }, [trending]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.gsap-hero', { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.2 });
            gsap.from('.gsap-section', { opacity: 0, y: 20, duration: 0.8, stagger: 0.2, ease: 'power2.out', delay: 0.4 });
        }, homeRef);
        return () => ctx.revert();
    }, [movieStatus]);

    useEffect(() => {
        if (heroPool.length === 0) return;
        heroTimerRef.current = setInterval(() => {
            setHeroFade(false);
            setTimeout(() => {
                setHeroIndex(prev => (prev + 1) % heroPool.length);
                setHeroFade(true);
            }, 400);
        }, 5000);
        return () => clearInterval(heroTimerRef.current);
    }, [heroPool]);

    const goToHero = (idx) => {
        clearInterval(heroTimerRef.current);
        setHeroFade(false);
        setTimeout(() => { setHeroIndex(idx); setHeroFade(true); }, 300);
    };

    useEffect(() => {
        if (historyStatus === 'idle') {
            dispatch(fetchWatchHistory());
        }
    }, [dispatch, historyStatus]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
            if (!loadingMore) {
                setLoadingMore(true);
                if (selectedGenreId) {
                    const currentGenrePage = moviesByGenre[selectedGenreId]?.page || 1;
                    if (currentGenrePage < 500) {
                        dispatch(fetchMoviesByGenre({ genreId: selectedGenreId, page: currentGenrePage + 1 })).finally(() => {
                            setTimeout(() => setLoadingMore(false), 500);
                        });
                    } else { setLoadingMore(false); }
                } else {
                    Promise.all([
                        popularPage < 500 ? dispatch(fetchPopularMovies(popularPage + 1)) : Promise.resolve(),
                        tvPage < 500 ? dispatch(fetchPopularTvShows(tvPage + 1)) : Promise.resolve()
                    ]).finally(() => {
                        setTimeout(() => setLoadingMore(false), 500);
                    });
                }
            }
        }
    }, [dispatch, loadingMore, popularPage, tvPage, selectedGenreId, moviesByGenre]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const renderContent = (items, isInitialLoading, localStatus) => {
        if (isInitialLoading && localStatus === 'loading') {
            return Array(10).fill(0).map((_, i) => <Skeleton key={i} />);
        }
        return items.map((movie) => (
            <MovieCard key={movie.id || movie._id} movie={movie} />
        ));
    };

    const activeHeroPool = heroPool.length > 0 ? heroPool : trending.slice(0, 15);
    const heroMovie = activeHeroPool[heroIndex % (activeHeroPool.length || 1)] || null;
    const heroType = heroMovie?.media_type || (heroMovie?.first_air_date ? 'tv' : 'movie');

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

    return (
        <div className="space-y-12 overflow-x-hidden pb-10" ref={homeRef}>
            <HeroCarousel
                heroMovie={heroMovie}
                heroFade={heroFade}
                heroIndex={heroIndex}
                heroType={heroType}
                activeHeroPool={activeHeroPool}
                goToHero={goToHero}
            />

            <HistorySection
                historyItems={historyItems}
                historyStatus={historyStatus}
                renderContent={renderContent}
            />

            <GenreFilter
                genres={genres}
                selectedGenreId={selectedGenreId}
                onGenreClick={handleGenreClick}
                onClearGenre={() => setSelectedGenreId(null)}
            />

            {selectedGenreId ? (
                <GenreResultsSection
                    selectedGenreId={selectedGenreId}
                    genres={genres}
                    moviesByGenre={moviesByGenre}
                    movieStatus={movieStatus}
                    renderContent={renderContent}
                    loadingMore={loadingMore}
                />
            ) : (
                <>
                    <TrendingSection
                        trending={trending}
                        movieStatus={movieStatus}
                        renderContent={renderContent}
                    />

                    <PopularMoviesSection
                        popularMovies={popularMovies}
                        movieStatus={movieStatus}
                        renderContent={renderContent}
                    />

                    <PopularTvSection
                        popularTvShows={popularTvShows}
                        movieStatus={movieStatus}
                        renderContent={renderContent}
                        loadingMore={loadingMore}
                    />
                </>
            )}

            {/* Footer */}
            <AttributionFooter />
        </div>
    );
};

export default Home;
