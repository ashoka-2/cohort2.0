const express = require('express');
const { getAllCustomMovies, getCustomMovieById } = require('../controllers/admin.controller');

const router = express.Router();

// Public routes to get custom movies
router.get('/custom', getAllCustomMovies);
router.get('/custom/:id', getCustomMovieById);

module.exports = router;
