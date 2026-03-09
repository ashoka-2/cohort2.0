import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tmdbService } from '../../services/api/tmdb.service';
import { apiService } from '../../services/api.service';

export const searchMovies = createAsyncThunk(
    'search/searchMovies',
    async (query, { rejectWithValue }) => {
        try {
            const [tmdbResults, customMovies] = await Promise.all([
                tmdbService.searchMulti(query),
                apiService.getCustomMovies()
            ]);

            // Filter custom movies locally since backend search isn't implemented for them
            const filteredCustom = customMovies.filter(m =>
                m.title.toLowerCase().includes(query.toLowerCase()) ||
                m.description.toLowerCase().includes(query.toLowerCase())
            );

            // Combine and return
            return [...filteredCustom, ...tmdbResults];
        } catch (error) {
            return rejectWithValue(error.toString());
        }
    }
);

const initialState = {
    results: [],
    query: '',
    searchType: 'movies',
    actorResults: [],
    recentQueries: JSON.parse(localStorage.getItem('recentQueries')) || [],
    status: 'initial',
    error: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearch: (state) => {
            state.results = [];
            state.query = '';
            state.actorResults = [];
            state.status = 'idle';
        },
        setSearchState: (state, action) => {
            state.query = action.payload.query;
            state.searchType = action.payload.searchType;
            if (action.payload.actorResults) state.actorResults = action.payload.actorResults;
        },
        addRecentQuery: (state, action) => {
            const query = action.payload.trim();
            if (!query) return;

            // Keep unique, most recent at front
            const filtered = state.recentQueries.filter(q => q.toLowerCase() !== query.toLowerCase());
            state.recentQueries = [query, ...filtered].slice(0, 5);
            localStorage.setItem('recentQueries', JSON.stringify(state.recentQueries));
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchMovies.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(searchMovies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.results = action.payload;
            })
            .addCase(searchMovies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { clearSearch, setSearchState, addRecentQuery } = searchSlice.actions;
export default searchSlice.reducer;
