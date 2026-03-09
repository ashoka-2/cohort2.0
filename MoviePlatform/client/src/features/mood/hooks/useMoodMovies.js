import { useState, useCallback } from 'react';
import { tmdbService } from '../../../services/api/tmdb.service';

const MOOD_TO_GENRE = {
    "Happy": [35, 16], // Comedy, Animation
    "Sad": [18, 10749], // Drama, Romance
    "Angry": [28, 53], // Action, Thriller
    "Surprised": [9648, 878, 14], // Mystery, Sci-Fi, Fantasy
    "Neutral": [99, 36], // Documentary, History
};

export const useMoodMovies = () => {
    const [mood, setMood] = useState(null);
    const [movies, setMovies] = useState([]);
    const [isFetchingMovies, setIsFetchingMovies] = useState(false);
    const [page, setPage] = useState(1);
    const [genreId, setGenreId] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const handleMoodDetected = async (detectedMood) => {
        setMood(detectedMood);
        setIsFetchingMovies(true);
        setPage(1);
        setHasMore(true);

        const genres = MOOD_TO_GENRE[detectedMood] || [35];
        const randomGenre = genres[Math.floor(Math.random() * genres.length)];
        setGenreId(randomGenre);

        try {
            const data = await tmdbService.getMoviesByGenre(randomGenre, 1);
            setMovies(data.results || []);
            if (data.page >= data.total_pages || data.page >= 500) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Fetch movies error:", err);
            setHasMore(false);
        } finally {
            setIsFetchingMovies(false);
        }
    };

    const fetchMoreMovies = useCallback(async () => {
        if (!hasMore || isFetchingMovies || !genreId) return;

        setIsFetchingMovies(true);
        const nextPage = page + 1;
        try {
            const data = await tmdbService.getMoviesByGenre(genreId, nextPage);
            setMovies((prev) => {
                // Filter out duplicates
                const newMovies = data.results || [];
                const existingIds = new Set(prev.map(m => m.id));
                return [...prev, ...newMovies.filter(m => !existingIds.has(m.id))];
            });
            setPage(nextPage);
            if (data.page >= data.total_pages || data.page >= 500) {
                setHasMore(false);
            }
        } catch (err) {
            console.error("Fetch more movies error:", err);
            setHasMore(false);
        } finally {
            setIsFetchingMovies(false);
        }
    }, [hasMore, isFetchingMovies, genreId, page]);

    const resetMood = () => {
        setMood(null);
        setMovies([]);
        setPage(1);
        setGenreId(null);
        setHasMore(true);
    };

    return {
        mood,
        movies,
        isFetchingMovies,
        hasMore,
        handleMoodDetected,
        fetchMoreMovies,
        resetMood
    };
};
