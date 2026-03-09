import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearch, setSearchState, addRecentQuery } from '../../features/search/searchSlice';
import { tmdbService } from '../../services/api/tmdb.service';
import MovieCard from '../../components/ui/MovieCard';
import Skeleton, { SearchSkeleton } from '../../components/ui/Skeleton';

// Internal Components
import SearchBar from './SearchBar';
import RecentSearches from './RecentSearches';
import SearchFilters from './SearchFilters';
import ActorCard from '../../components/ui/ActorCard';

const Search = () => {
    const dispatch = useDispatch();
    const { results, status, query: savedQuery, searchType: savedType, actorResults: savedActors, recentQueries } = useSelector((state) => state.search);

    const [query, setQuery] = useState(savedQuery || '');
    const [searchType, setSearchType] = useState(savedType || 'movies'); // 'movies' or 'actors'
    const [actorResults, setActorResults] = useState(savedActors || []);
    const [actorLoading, setActorLoading] = useState(false);
    const [showRecent, setShowRecent] = useState(false);

    // Debouncing effect
    useEffect(() => {
        const timer = setTimeout(async () => {
            // Persist local state to Redux
            dispatch(setSearchState({ query, searchType, actorResults }));

            if (query.trim()) {
                if (searchType === 'movies') {
                    if (status === 'initial' || query !== savedQuery) {
                        dispatch(searchMovies(query));
                        dispatch(addRecentQuery(query));
                    }
                } else {
                    if (actorResults.length === 0 || query !== savedQuery) {
                        setActorLoading(true);
                        try {
                            const actors = await tmdbService.searchActors(query);
                            setActorResults(actors);
                            dispatch(setSearchState({ query, searchType, actorResults: actors }));
                            dispatch(addRecentQuery(query));
                        } catch (e) {
                            console.error(e);
                        } finally {
                            setActorLoading(false);
                        }
                    }
                }
            } else if (query === '') {
                dispatch(clearSearch());
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, searchType, dispatch]);

    const handleRecentClick = (q) => {
        setQuery(q);
        setShowRecent(false);
    };

    return (
        <div className="min-h-screen py-8">
            <SearchBar
                query={query}
                onChange={setQuery}
                onFocus={() => setShowRecent(true)}
                onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            />

            <RecentSearches
                queries={recentQueries}
                onQueryClick={handleRecentClick}
                visible={query === '' || showRecent}
            />

            <SearchFilters
                searchType={searchType}
                onTypeChange={(type) => {
                    setSearchType(type);
                    if (query) {
                        if (type === 'movies') dispatch(searchMovies(query));
                        else tmdbService.searchActors(query).then(setActorResults);
                    }
                }}
            />

            {(status === 'loading' || actorLoading) && (
                <SearchSkeleton count={10} />
            )}

            {searchType === 'movies' && status === 'succeeded' && results.length === 0 && query && (
                <div className="text-center text-textSub mt-12 text-xl">
                    No results found for "{query}"
                </div>
            )}

            {searchType === 'actors' && !actorLoading && actorResults.length === 0 && query && (
                <div className="text-center text-textSub mt-12 text-xl">
                    No actors found for "{query}"
                </div>
            )}

            {searchType === 'movies' ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {results.map((movie) => (
                        <MovieCard key={movie.id || movie._id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {actorResults.map((actor) => (
                        <ActorCard key={actor.id} actor={actor} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;
