const Movie = require("../models/movie.model");
const User = require("../models/user.model");

const addMovie = async (req, res) => {
    const {
        movieId,
        title,
        description,
        posterUrl,
        trailerUrl,
        releaseDate,
        genre,
        category,
    } = req.body;

    try {
        const movie = await Movie.create({
            movieId,
            title,
            description,
            posterUrl,
            trailerUrl,
            releaseDate,
            genre,
            category,
        });

        res.status(201).json(movie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie)
            return res.status(404).json({
                message: "Movie not found",
            });

        const fields = [
            "movieId",
            "title",
            "description",
            "posterUrl",
            "trailerUrl",
            "releaseDate",
            "genre",
            "category",
        ];
        const updates = {};
        fields.forEach((f) => {
            if (req.body[f] !== undefined) updates[f] = req.body[f];
        });

        const updatedMovie = await Movie.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true },
        );
        res.json(updatedMovie);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const deleteMovie = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie)
            return res.status(404).json({
                message: "Movie not found",
            });

        await Movie.deleteOne({ _id: movie._id });

        res.json({
            message: "Movie removed",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllCustomMovies = async (req, res) => {
    try {
        const movies = await Movie.find({});
        res.json(movies);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getCustomMovieById = async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie)
            return res.status(404).json({
                message: "Movie not found",
            });
        res.json(movie);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const banUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                message: "User not found",
            });

        if (user.isAdmin)
            return res.status(403).json({
                message: "Cannot ban an admin",
            });

        const newBanStatus = !user.isBanned;

        await User.findByIdAndUpdate(
            req.params.id,
            { $set: { isBanned: newBanStatus } },
            { runValidators: false },
        );

        res.json({
            message: `User ${newBanStatus ? "banned" : "unbanned"} successfully`,
            isBanned: newBanStatus,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({
                message: "User not found",
            });

        if (user.isAdmin)
            return res.status(403).json({ message: "Cannot delete an admin" });

        await User.deleteOne({ _id: user._id });
        res.json({
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addMovie,
    updateMovie,
    deleteMovie,
    getAllCustomMovies,
    getCustomMovieById,
    getAllUsers,
    banUser,
    deleteUser,
};
