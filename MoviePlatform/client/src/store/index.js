import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import movieReducer from '../features/movies/movieSlice';
import searchReducer from '../features/search/searchSlice';
import favoritesReducer from '../features/movies/favoritesSlice';
import themeReducer from '../features/theme/themeSlice';
import historyReducer from '../features/movies/historySlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        movies: movieReducer,
        search: searchReducer,
        favorites: favoritesReducer,
        theme: themeReducer,
        history: historyReducer,
    },
});
