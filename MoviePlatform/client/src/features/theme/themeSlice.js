import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    mode: localStorage.getItem('theme') || 'dark', // default to dark
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.mode = state.mode === 'dark' ? 'light' : 'dark';
            localStorage.setItem('theme', state.mode);
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
