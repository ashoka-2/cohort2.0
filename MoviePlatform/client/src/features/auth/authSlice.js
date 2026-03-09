import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/api.service.js';

// Standard login action
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await apiService.login(credentials.username || credentials.email, credentials.password);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Standard register action
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (credentials, { rejectWithValue }) => {
        try {
            const data = await apiService.register(credentials.username, credentials.email, credentials.password);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

export const logoutUserThunk = createAsyncThunk(
    'auth/logoutUser',
    async (_, { rejectWithValue }) => {
        try {
            await apiService.logout();
            localStorage.removeItem('user');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

// Fetches the latest user profile from the server and updates localStorage.
// Call this on app startup so fields like isAdmin are always fresh.
export const refreshUser = createAsyncThunk(
    'auth/refreshUser',
    async (_, { rejectWithValue }) => {
        try {
            const data = await apiService.getMe();
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } catch {
            return rejectWithValue('Session expired');
        }
    }
);

// Helper payload creator
const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};

const user = getUserFromStorage();

const initialState = {
    user: user,
    isAuthenticated: !!user,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.status = 'idle';
            state.error = null;
            localStorage.removeItem('user');
        },
        setCredentials: (state, action) => {
            const user = action.payload;
            state.user = user;
            state.isAuthenticated = true;
            localStorage.setItem('user', JSON.stringify(user));
        },
        hydrateAuth: (state) => {
            const currentUser = getUserFromStorage();
            if (currentUser) {
                state.user = currentUser;
                state.isAuthenticated = true;
            } else {
                state.user = null;
                state.isAuthenticated = false;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Logout Thunk
            .addCase(logoutUserThunk.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.status = 'idle';
                state.error = null;
            })
            // refreshUser: sync latest user data (incl. isAdmin) from server
            .addCase(refreshUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(refreshUser.rejected, (state) => {
                // Token expired or invalid — clear session
                state.user = null;
                state.isAuthenticated = false;
                localStorage.removeItem('user');
            });
    },
});

export const { logout, hydrateAuth, setCredentials } = authSlice.actions;
export default authSlice.reducer;
