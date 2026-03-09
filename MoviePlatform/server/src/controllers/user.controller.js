const User = require("../models/user.model");
const Favorite = require("../models/favorite.model");
const History = require("../models/history.model");

const getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({
            user: req.user._id,
        }).sort("-createdAt");

        const formatted = favorites.map((f) => ({
            id: f.movieId,
            title: f.title,
            poster_path: f.poster_path,
            vote_average: f.vote_average,
            media_type: f.media_type,
        }));

        res.json(formatted);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const addFavorite = async (req, res) => {
    try {
        const movie = req.body;

        const existing = await Favorite.findOne({
            user: req.user._id,
            movieId: movie.id,
        });
        if (existing) {
            return res.status(400).json({
                message: "Movie already in favorites",
            });
        }

        await Favorite.create({
            user: req.user._id,
            movieId: movie.id,
            title: movie.title || movie.name || "Unknown Title",
            poster_path: movie.poster_path || "",
            vote_average: movie.vote_average || 0,
            media_type: movie.media_type || (movie.first_air_date ? "tv" : "movie"),
        });

        const favorites = await Favorite.find({
            user: req.user._id,
        }).sort("-createdAt");
        const formatted = favorites.map((f) => ({
            id: f.movieId,
            title: f.title,
            poster_path: f.poster_path,
            vote_average: f.vote_average,
            media_type: f.media_type,
        }));

        res.status(201).json(formatted);
        
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const removeFavorite = async (req, res) => {
    try {
        await Favorite.findOneAndDelete({
            user: req.user._id,
            movieId: req.params.id,
        });

        const favorites = await Favorite.find({
            user: req.user._id,
        }).sort("-createdAt");
        const formatted = favorites.map((f) => ({
            id: f.movieId,
            title: f.title,
            poster_path: f.poster_path,
            vote_average: f.vote_average,
            media_type: f.media_type,
        }));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const getWatchHistory = async (req, res) => {
    try {
        const history = await History.aggregate([
            { $match: { user: req.user._id } },
            { $sort: { watchedAt: -1 } },
            { $group: { _id: "$movieId", doc: { $first: "$$ROOT" } } },
            { $replaceRoot: { newRoot: "$doc" } },
            { $sort: { watchedAt: -1 } },
            { $limit: 20 },
        ]);

        const formatted = history.map((h) => ({
            id: h.movieId,
            title: h.title,
            poster_path: h.poster_path,
            vote_average: h.vote_average,
            media_type: h.media_type,
            watchedAt: h.watchedAt,
        }));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};



const addToWatchHistory = async (req, res) => {
    try {
        const movie = req.body;

        await History.findOneAndUpdate(
            { user: req.user._id, movieId: movie.id },
            {
                $set: {
                    title: movie.title || movie.name,
                    poster_path: movie.poster_path,
                    vote_average: movie.vote_average,
                    media_type:
                        movie.media_type ||
                        (movie.first_air_date || movie.name ? "tv" : "movie"),
                    watchedAt: new Date(),
                },
            },
            { upsert: true, returnDocument: "after" },
        );

        res.status(201).json({
            message: "Added to history",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};


module.exports = {
    getFavorites,
    addFavorite,
    removeFavorite,
    getWatchHistory,
    addToWatchHistory,
};
