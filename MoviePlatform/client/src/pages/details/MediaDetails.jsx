import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../features/movies/favoritesSlice';
import { addToWatchHistoryAction } from '../../features/movies/historySlice';
import { tmdbService } from '../../services/api/tmdb.service';
import { apiService } from '../../services/api.service';
import { MovieDetailsSkeleton } from '../../components/ui/Skeleton';

// Internal Components
import MediaHero from './MediaHero';
import CastSection from './CastSection';
import RecommendationsSection from './RecommendationsSection';
import VideoModal from './VideoModal';

const MediaDetails = () => {
    const { type, id } = useParams(); // type is 'movie' or 'tv'
    const [media, setMedia] = useState(null);
    const [trailer, setTrailer] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [cast, setCast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const dispatch = useDispatch();
    const { items: favorites } = useSelector(state => state.favorites);
    const { isAuthenticated } = useSelector(state => state.auth);

    const isFavorite = favorites.some(fav => (fav.id === parseInt(id) || fav.id === id));

    useEffect(() => {
        setIsPlaying(false);
        let cancelled = false;

        const fetchDetails = async () => {
            setLoading(true);
            try {
                // If it's a 24-char hex ID, it's from our own API (Custom Movies)
                const isCustomId = /^[0-9a-fA-F]{24}$/.test(id);

                let data;
                if (isCustomId) {
                    const customData = await apiService.getCustomMovieById(id);
                    data = {
                        ...customData,
                        id: customData._id,
                        media_type: customData.category?.toLowerCase().includes('tv') ? 'tv' : 'movie',
                        overview: customData.description,
                        vote_average: customData.vote_average || 0,
                        poster_path: customData.posterUrl,
                        backdrop_path: customData.posterUrl,
                        videos: { results: [{ key: customData.trailerUrl.split('v=')[1] || customData.trailerUrl, site: 'YouTube', type: 'Trailer' }] }
                    };
                } else {
                    data = await tmdbService.getMediaDetails(type, id);
                }

                if (cancelled) return;
                setMedia(data);

                const trailerVideo = data.videos?.results?.find(
                    vid => vid.type === 'Trailer' && vid.site === 'YouTube'
                );
                if (trailerVideo) setTrailer(trailerVideo);

                if (!isCustomId) {
                    if (data.recommendations?.results) {
                        setRecommendations(data.recommendations.results.slice(0, 10));
                    }
                    const credits = await tmdbService.getMediaCredits(type, id);
                    if (cancelled) return;
                    setCast(credits.slice(0, 10));
                }

                if (isAuthenticated) {
                    dispatch(addToWatchHistoryAction(data)).catch(console.error);
                }
            } catch (error) {
                if (!cancelled) console.error(`Failed to fetch ${type} details`, error);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        fetchDetails();
        return () => { cancelled = true; };
    }, [type, id, dispatch, isAuthenticated]);

    const handleFavoriteToggle = () => {
        if (!isAuthenticated) return alert('Please login to add favorites');
        if (isFavorite) {
            dispatch(removeFavorite(media.id || media._id));
        } else {
            dispatch(addFavorite({
                id: media.id || media._id,
                title: media.title || media.name,
                poster_path: media.poster_path,
                vote_average: media.vote_average,
                media_type: media.media_type || type
            }));
        }
    };

    if (loading) return <MovieDetailsSkeleton />;
    if (!media) return <div className="text-center text-red-500 mt-20 text-2xl uppercase font-bold tracking-widest">{type} not found</div>;

    const title = media.title || media.name;
    const releaseDate = media.release_date || media.first_air_date;
    const runtime = media.runtime || (media.episode_run_time ? media.episode_run_time[0] : null);

    return (
        <div className="pb-20 animate-fade-in">
            <MediaHero
                media={media}
                title={title}
                type={type}
                releaseDate={releaseDate}
                runtime={runtime}
                trailer={trailer}
                isFavorite={isFavorite}
                handleFavoriteToggle={handleFavoriteToggle}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                setIsPlaying={setIsPlaying}
            />

            <CastSection cast={cast} />

            <RecommendationsSection recommendations={recommendations} type={type} />

            <VideoModal
                trailer={trailer}
                media={media}
                title={title}
                onClose={() => setIsPlaying(false)}
                isPlaying={isPlaying}
            />
        </div>
    );
};

export default MediaDetails;
