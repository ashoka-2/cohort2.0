import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.service';

export const fetchFavorites = createAsyncThunk('favorites/fetchAll', async (_, { getState }) => {
    return await apiService.getFavorites(getState);
});

export const addFavorite = createAsyncThunk('favorites/add', async (movie, { getState }) => {
    return await apiService.addFavorite(movie, getState);
});

export const removeFavorite = createAsyncThunk('favorites/remove', async (id, { getState }) => {
    return await apiService.removeFavorite(id, getState);
});

const favoritesSlice = createSlice({
    name: 'favorites',
    initialState: {
        items: [],
        status: 'idle',
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = action.payload;
            });
    },
});

export default favoritesSlice.reducer;
