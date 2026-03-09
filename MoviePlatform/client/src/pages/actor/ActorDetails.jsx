import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { tmdbService } from '../../services/api/tmdb.service';
import { ActorDetailsSkeleton } from '../../components/ui/Skeleton';

// Internal Components
import ActorHero from './ActorHero';
import ActorStats from './ActorStats';
import ActorBio from './ActorBio';
import ActorMovies from './ActorMovies';

const ActorDetails = () => {
    const { id } = useParams();
    const [actor, setActor] = useState(null);
    const [movies, setMovies] = useState([]);
    const [backdrop, setBackdrop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    useEffect(() => {
        const fetchActorData = async () => {
            setLoading(true);
            try {
                const [personData, creditsData] = await Promise.all([
                    tmdbService.getPersonDetails(id),
                    tmdbService.getPersonCombinedCredits(id)
                ]);
                setActor(personData);

                const accurateMovies = creditsData
                    .filter(m => m.media_type === 'movie' && m.poster_path)
                    .sort((a, b) => b.vote_count - a.vote_count);

                const topMovieWithBackdrop = accurateMovies.find(m => m.backdrop_path);
                if (topMovieWithBackdrop) {
                    setBackdrop(`https://image.tmdb.org/t/p/original${topMovieWithBackdrop.backdrop_path}`);
                }

                setMovies(accurateMovies.slice(0, 20));
            } catch (error) {
                console.error('Failed to fetch actor details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchActorData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <ActorDetailsSkeleton />;
    if (!actor) return <div className="text-center text-red-500 mt-20 text-2xl drop-shadow-lg">Actor not found</div>;

    const profileUrl = actor.profile_path
        ? `https://image.tmdb.org/t/p/h632${actor.profile_path}`
        : null;

    return (
        <div className="pb-20">
            <ActorHero actor={actor} backdrop={backdrop} profileUrl={profileUrl} />

            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-32 md:mt-40">
                <div className="flex flex-col lg:flex-row gap-16">
                    <ActorStats actor={actor} />
                    <ActorBio
                        actor={actor}
                        isExpanded={isBioExpanded}
                        onToggle={() => setIsBioExpanded(!isBioExpanded)}
                    />
                </div>
            </div>

            <ActorMovies movies={movies} />
        </div>
    );
};

export default ActorDetails;
