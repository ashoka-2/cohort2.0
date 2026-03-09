const mongoose = require("mongoose");


const movieSchema = new mongoose.Schema(
  {
    movieId: {
      type: String,
      default: "",
    }, // TMDB or custom ID
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    posterUrl: {
      type: String,
      required: true,
    },
    trailerUrl: {
      type: String,
      required: true,
    }, // Full YouTube URL
    releaseDate: {
      type: Date,
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Movie", "TV Show"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
