import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.service';

// Fetch watch history:
//  - Authenticated → from backend DB (cookie sent automatically via withCredentials)
//  - Guest         → from localStorage
export const fetchWatchHistory = createAsyncThunk(
    'history/fetchWatchHistory',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            if (auth.isAuthenticated) {
                // Token is in httpOnly cookie — axios sends it automatically
                return await apiService.getWatchHistory();
            }
            // Guest fallback
            return JSON.parse(localStorage.getItem('watchHistory')) || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
        }
    }
);

// Add a movie to watch history:
//  - Authenticated → persists to DB via API (cookie auth), updates Redux immediately
//  - Guest         → updates localStorage + Redux state
export const addToWatchHistoryAction = createAsyncThunk(
    'history/addToWatchHistory',
    async (movie, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const actualId = movie.id || movie._id;
            const entry = {
                id: actualId,
                title: movie.title || movie.name,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                media_type: movie.media_type || (movie.category?.toLowerCase().includes('tv') || movie.first_air_date || movie.name ? 'tv' : 'movie'),
                watchedAt: new Date().toISOString(),
            };

            if (auth.isAuthenticated) {
                // Token is in httpOnly cookie — axios sends it automatically
                await apiService.addToWatchHistory(entry);
            } else {
                // Guest: persist only to localStorage
                const local = JSON.parse(localStorage.getItem('watchHistory')) || [];
                const filtered = local.filter(i => i.id !== entry.id && i._id !== entry.id);
                filtered.unshift(entry);
                localStorage.setItem('watchHistory', JSON.stringify(filtered.slice(0, 20)));
            }

            return entry;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add to history');
        }
    }
);

const historySlice = createSlice({
    name: 'history',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        // Allow manual reset so Home re-fetches after navigation
        resetHistory: (state) => {
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchWatchHistory.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchWatchHistory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchWatchHistory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // When a movie is added, push it to the front of items immediately
            .addCase(addToWatchHistoryAction.fulfilled, (state, action) => {
                const entry = action.payload;
                // Remove duplicate if already in list
                state.items = [
                    entry,
                    ...state.items.filter(i => i.id !== entry.id && i._id !== entry.id)
                ].slice(0, 20);
            });
    },
});

export const { resetHistory } = historySlice.actions;
export default historySlice.reducer;
