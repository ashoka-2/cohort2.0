const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
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
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Unique per (user + movie) — prevents duplicate entries at DB level.
// The controller also uses upsert so the same movie just refreshes watchedAt.
historySchema.index({ user: 1, movieId: 1 }, { unique: true });

// Fast sorted fetch for "recently watched" queries
historySchema.index({ user: 1, watchedAt: -1 });

const History = mongoose.model("History", historySchema);
module.exports = History;
