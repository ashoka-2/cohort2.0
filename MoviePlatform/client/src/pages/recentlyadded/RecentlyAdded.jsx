import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrending, fetchGenres, fetchTvGenres } from '../../features/movies/movieSlice';
import MovieCard from '../../components/ui/MovieCard';
import Skeleton from '../../components/ui/Skeleton';
import gsap from 'gsap';
import SectionHeader from '../../components/ui/SectionHeader';
import GenreBar from '../../components/ui/GenreBar';

const RecentlyAdded = () => {
    const dispatch = useDispatch();
    const { trending, status, genres, tvGenres } = useSelector((state) => state.movies);
    const [selectedGenreId, setSelectedGenreId] = useState(null);
    const containerRef = useRef(null);

    useEffect(() => {
        if (trending.length === 0) dispatch(fetchTrending());
        if (genres.length === 0) dispatch(fetchGenres());
        if (tvGenres.length === 0) dispatch(fetchTvGenres());
    }, [dispatch, trending.length, genres.length, tvGenres.length]);

    useEffect(() => {
        if (status === 'succeeded' || trending.length > 0) {
            const ctx = gsap.context(() => {
                const titles = gsap.utils.toArray('.gsap-recent-title:not(.animated)');
                if (titles.length > 0) {
                    titles.forEach(t => t.classList.add('animated'));
                    gsap.fromTo(titles, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
                }

                const cards = gsap.utils.toArray('.gsap-recent-card:not(.animated)');
                if (cards.length > 0) {
                    cards.forEach(c => c.classList.add('animated'));
                    gsap.fromTo(cards, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.3 });
                }
            }, containerRef);
            return () => ctx.revert();
        }
    }, [status, trending, selectedGenreId]);

    const allGenres = Array.from(new Map([...genres, ...tvGenres].map(g => [g.id, g])).values());

    const handleGenreClick = (id) => {
        setSelectedGenreId(id === selectedGenreId ? null : id);
    };

    const renderContent = () => {
        if (trending.length === 0) {
            return Array(20).fill(0).map((_, i) => <Skeleton key={i} />);
        }

        const filtered = selectedGenreId
            ? trending.filter(movie => {
                if (movie.genre_ids?.includes(selectedGenreId)) return true;
                const targetGenreName = allGenres.find(g => g.id === selectedGenreId)?.name;
                if (movie.genre && targetGenreName && movie.genre.toLowerCase() === targetGenreName.toLowerCase()) return true;
                return false;
            })
            : trending;

        if (filtered.length === 0 && selectedGenreId) {
            return <div className="col-span-full py-20 text-center text-textSub text-xl">No "{allGenres.find(g => g.id === selectedGenreId)?.name}" titles found in recently added</div>;
        }

        return filtered.map((movie) => (
            <div key={movie.id || movie._id} className="gsap-recent-card">
                <MovieCard movie={movie} />
            </div>
        ));
    }

    return (
        <div className="space-y-8" ref={containerRef}>
            <div className="space-y-6">
                <SectionHeader
                    title="Recently"
                    highlight="Added"
                    badge1="New"
                    badge2="Trending"
                    className="gsap-recent-title"
                />
                <GenreBar
                    genres={allGenres}
                    selectedId={selectedGenreId}
                    onGenreClick={handleGenreClick}
                    allText="Recent All"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default RecentlyAdded;
