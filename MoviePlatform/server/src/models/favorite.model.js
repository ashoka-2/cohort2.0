const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movieId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    poster_path: {
      type: String,
    },
    vote_average: {
      type: Number,
    },
    media_type: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
  },
  {
    timestamps: true,
  },
);

// Ensure a user can only favorite a specific movie once
favoriteSchema.index({ user: 1, movieId: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);
module.exports = Favorite;
