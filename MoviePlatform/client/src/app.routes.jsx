import { Routes, Route, Navigate } from 'react-router';
import { useSelector } from 'react-redux';
import Home from './pages/home/Home';
import Search from './pages/search/Search';
import MovieDetails from './pages/details/MediaDetails';
import ActorDetails from './pages/actor/ActorDetails';
import Favorites from './pages/favorites/Favorites';
import RecentlyAdded from './pages/recentlyadded/RecentlyAdded';
import Login from './pages/auth/Login';
import Admin from './pages/admin/Admin';
import Movies from './pages/movies/Movies';
import TvShows from './pages/tvshows/TvShows';
import MoodRecommendation from './pages/mood/MoodRecommendation';

const AppRoutes = () => {
    const { isAuthenticated } = useSelector(state => state.auth);

    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv" element={<TvShows />} />
            <Route path="/search" element={<Search />} />
            <Route path="/recent" element={<RecentlyAdded />} />
            <Route path="/mood" element={<MoodRecommendation />} />
            <Route path="/details/:type/:id" element={<MovieDetails />} />
            <Route path="/actor/:id" element={<ActorDetails />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
