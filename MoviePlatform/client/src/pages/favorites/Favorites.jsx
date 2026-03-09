import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFavorites, removeFavorite } from '../../features/movies/favoritesSlice';
import { MovieCardSkeleton } from '../../components/ui/Skeleton';

// Internal Components
import FavoritesEmpty from './FavoritesEmpty';
import FavoritesUnauthenticated from './FavoritesUnauthenticated';
import FavoriteItem from './FavoriteItem';
import SectionHeader from '../../components/ui/SectionHeader';

const Favorites = () => {
    const dispatch = useDispatch();
    const { items, status } = useSelector((state) => state.favorites);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchFavorites());
        }
    }, [dispatch, isAuthenticated]);

    if (!isAuthenticated) return <FavoritesUnauthenticated />;

    const isLoading = status === 'loading' || status === 'idle';

    return (
        <div className="space-y-8">
            <SectionHeader
                title="My"
                highlight="Favorites"
                badge1={!isLoading && items.length > 0 ? `${items.length} title${items.length !== 1 ? 's' : ''}` : null}
            />

            {isLoading && (
                <div className="glass-panel p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {Array(10).fill(0).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <MovieCardSkeleton />
                                <div className="h-3 w-2/3 rounded-full skeleton-shimmer mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!isLoading && items.length === 0 && <FavoritesEmpty />}

            {!isLoading && items.length > 0 && (
                <div className="glass-panel p-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {items.map((movie) => (
                            <FavoriteItem
                                key={movie.id}
                                movie={movie}
                                onRemove={(id) => dispatch(removeFavorite(id))}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Favorites;
