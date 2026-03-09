import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const tmdbService = {
    getTrending: async () => {
        const { data } = await axios.get(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
        return data;
    },
    // Fetches a random page of discover/movie so hero changes on every reload
    getRandomHeroMovies: async () => {
        const randomPage = Math.floor(Math.random() * 10) + 1;
        const { data } = await axios.get(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${randomPage}&vote_count.gte=100`
        );
        // Only keep entries that have a backdrop
        return data.results.filter(m => m.backdrop_path && m.overview);
    },
    getPopularMovies: async (page = 1) => {
        const { data } = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`);
        return data;
    },
    getGenres: async () => {
        const { data } = await axios.get(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}`);
        return data.genres;
    },
    getTvGenres: async () => {
        const { data } = await axios.get(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
        return data.genres;
    },
    getMoviesByGenre: async (genreId, page = 1) => {
        const { data } = await axios.get(`${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        return data;
    },
    getTvShowsByGenre: async (genreId, page = 1) => {
        const { data } = await axios.get(`${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreId}&page=${page}`);
        return data;
    },
    getPopularTvShows: async (page = 1) => {
        const { data } = await axios.get(`${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`);
        return data;
    },
    searchMulti: async (query) => {
        const { data } = await axios.get(`${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`);
        return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
    },
    getMediaDetails: async (type, id) => {
        const { data } = await axios.get(`${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos,recommendations`);
        return data;
    },
    getMediaVideos: async (id, type) => {
        const { data } = await axios.get(`${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`);
        return data;
    },
    searchActors: async (query) => {
        const { data } = await axios.get(`${BASE_URL}/search/person?api_key=${API_KEY}&query=${query}`);
        return data.results;
    },
    getMediaCredits: async (type, id) => {
        const { data } = await axios.get(`${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`);
        return data.cast;
    },
    getPersonDetails: async (id) => {
        const { data } = await axios.get(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
        return data;
    },
    getPersonCombinedCredits: async (id) => {
        const { data } = await axios.get(`${BASE_URL}/person/${id}/combined_credits?api_key=${API_KEY}`);
        return data.cast;
    }
};

export default tmdbService;
