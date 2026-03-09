import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true
});

export const apiService = {
    // Public Movie Discovery
    getCustomMovies: async () => {
        const { data } = await axiosInstance.get(`/movies/custom`);
        return data;
    },
    getCustomMovieById: async (id) => {
        const { data } = await axiosInstance.get(`/movies/custom/${id}`);
        return data;
    },

    // Auth Routes
    login: async (formData) => {
        const { data } = await axiosInstance.post(`/auth/login`, formData);
        return data;
    },
    register: async (formData) => {
        const { data } = await axiosInstance.post(`/auth/register`, formData);
        return data;
    },
    logout: async () => {
        const { data } = await axiosInstance.post(`/auth/logout`);
        return data;
    },
    getMe: async () => {
        const { data } = await axiosInstance.get(`/auth/me`);
        return data;
    },


    // User Routes
    getFavorites: async () => {
        const { data } = await axiosInstance.get(`/users/favorites`);
        return data;
    },
    addFavorite: async (movie) => {
        const { data } = await axiosInstance.post(`/users/favorites`, movie);
        return data;
    },
    removeFavorite: async (id) => {
        const { data } = await axiosInstance.delete(`/users/favorites/${id}`);
        return data;
    },
    getWatchHistory: async () => {
        const { data } = await axiosInstance.get(`/users/watch-history`);
        return data;
    },
    addToWatchHistory: async (movie) => {
        await axiosInstance.post(`/users/watch-history`, movie);
    },

    // Admin Routes
    adminGetMovies: async () => {
        const { data } = await axiosInstance.get(`/admin/movies`);
        return data;
    },
    adminAddMovie: async (movieData) => {
        const { data } = await axiosInstance.post(`/admin/movies`, movieData);
        return data;
    },
    adminUpdateMovie: async (id, movieData) => {
        const { data } = await axiosInstance.put(`/admin/movies/${id}`, movieData);
        return data;
    },
    adminDeleteMovie: async (id) => {
        const { data } = await axiosInstance.delete(`/admin/movies/${id}`);
        return data;
    },

    // Admin User Routes
    adminGetUsers: async () => {
        const { data } = await axiosInstance.get(`/admin/users`);
        return data;
    },
    adminBanUser: async (id) => {
        const { data } = await axiosInstance.put(`/admin/users/${id}/ban`, {});
        return data;
    },
    adminDeleteUser: async (id) => {
        const { data } = await axiosInstance.delete(`/admin/users/${id}`);
        return data;
    }
};
