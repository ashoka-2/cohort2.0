export const EMPTY_FORM = {
    movieId: '', title: '', description: '', posterUrl: '',
    trailerUrl: '', releaseDate: '', genre: '', category: 'Movie',
};

export const extractYouTubeId = (url = '') => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^&\n?#]+)/);
    return match?.[1] || null;
};
