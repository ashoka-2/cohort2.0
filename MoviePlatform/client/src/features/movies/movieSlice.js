import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbService } from '../../services/api/tmdb.service';
import { apiService } from '../../services/api.service';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async () => {
    const [tmdbData, customMovies] = await Promise.all([
        tmdbService.getTrending(),
        apiService.getCustomMovies()
    ]);

    // Merge custom movies at the front for maximum visibility as 'Recently Added'
    return [...customMovies, ...tmdbData.results];
});

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopularMovies', async (page = 1) => {
    const [tmdbData, customMovies] = await Promise.all([
        tmdbService.getPopularMovies(page),
        page === 1 ? apiService.getCustomMovies() : Promise.resolve([])
    ]);

    // Categorize custom content
    const customOnlyMovies = customMovies.filter(m => !m.category?.toLowerCase().includes('tv') && !m.category?.toLowerCase().includes('series'));

    return {
        results: page === 1 ? [...customOnlyMovies, ...tmdbData.results] : tmdbData.results,
        page
    };
});

export const fetchPopularTvShows = createAsyncThunk('movies/fetchPopularTvShows', async (page = 1) => {
    const [tmdbData, customMovies] = await Promise.all([
        tmdbService.getPopularTvShows(page),
        page === 1 ? apiService.getCustomMovies() : Promise.resolve([])
    ]);

    // Categorize custom content (Web Series / TV Shows)
    const customOnlyTv = customMovies.filter(m => m.category?.toLowerCase().includes('tv') || m.category?.toLowerCase().includes('series'));

    return {
        results: page === 1 ? [...customOnlyTv, ...tmdbData.results] : tmdbData.results,
        page
    };
});

export const fetchGenres = createAsyncThunk('movies/fetchGenres', async () => {
    return await tmdbService.getGenres();
});

export const fetchTvGenres = createAsyncThunk('movies/fetchTvGenres', async () => {
    return await tmdbService.getTvGenres();
});

export const fetchMoviesByGenre = createAsyncThunk('movies/fetchMoviesByGenre', async ({ genreId, page = 1 }) => {
    const data = await tmdbService.getMoviesByGenre(genreId, page);
    return { results: data.results, page, genreId };
});

export const fetchTvShowsByGenre = createAsyncThunk('movies/fetchTvShowsByGenre', async ({ genreId, page = 1 }) => {
    const data = await tmdbService.getTvShowsByGenre(genreId, page);
    return { results: data.results, page, genreId };
});

const initialState = {
    trending: [],
    popularMovies: [],
    popularPage: 1,
    popularTvShows: [],
    tvPage: 1,
    genres: [],
    tvGenres: [],
    moviesByGenre: {}, // e.g., { [genreId]: { results: [], page: 1 } }
    tvShowsByGenre: {},
    status: 'idle',
    error: null,
};

const movieSlice = createSlice({
    name: 'movies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrending.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTrending.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.trending = action.payload;
            })
            .addCase(fetchTrending.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(fetchPopularMovies.fulfilled, (state, action) => {
                if (action.payload.page === 1) {
                    state.popularMovies = action.payload.results;
                } else {
                    const newMovies = action.payload.results.filter(
                        newMovie => !state.popularMovies.some(existing => existing.id === newMovie.id)
                    );
                    state.popularMovies = [...state.popularMovies, ...newMovies];
                }
                state.popularPage = action.payload.page;
            })
            .addCase(fetchPopularTvShows.fulfilled, (state, action) => {
                if (action.payload.page === 1) {
                    state.popularTvShows = action.payload.results;
                } else {
                    // Filter duplicates in case the API returns the same TV show
                    const newShows = action.payload.results.filter(
                        newShow => !state.popularTvShows.some(existing => existing.id === newShow.id)
                    );
                    state.popularTvShows = [...state.popularTvShows, ...newShows];
                }
                state.tvPage = action.payload.page;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.genres = action.payload;
            })
            .addCase(fetchTvGenres.fulfilled, (state, action) => {
                state.tvGenres = action.payload;
            })
            .addCase(fetchMoviesByGenre.fulfilled, (state, action) => {
                const { genreId, results, page } = action.payload;
                if (!state.moviesByGenre[genreId] || page === 1) {
                    state.moviesByGenre[genreId] = { results, page };
                } else {
                    const existingResults = state.moviesByGenre[genreId].results;
                    const newMovies = results.filter(newMovie => !existingResults.some(existing => existing.id === newMovie.id));
                    state.moviesByGenre[genreId] = {
                        results: [...existingResults, ...newMovies],
                        page
                    };
                }
            })
            .addCase(fetchTvShowsByGenre.fulfilled, (state, action) => {
                const { genreId, results, page } = action.payload;
                if (!state.tvShowsByGenre[genreId] || page === 1) {
                    state.tvShowsByGenre[genreId] = { results, page };
                } else {
                    const existingResults = state.tvShowsByGenre[genreId].results;
                    const newShows = results.filter(newShow => !existingResults.some(existing => existing.id === newShow.id));
                    state.tvShowsByGenre[genreId] = {
                        results: [...existingResults, ...newShows],
                        page
                    };
                }
            });
    },
});

export default movieSlice.reducer;
