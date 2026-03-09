const express = require('express');
const { getFavorites, addFavorite, removeFavorite, getWatchHistory, addToWatchHistory } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/favorites', protect, getFavorites);
router.post('/favorites', protect, addFavorite);
router.delete('/favorites/:id', protect, removeFavorite);

router.get('/watch-history', protect, getWatchHistory);
router.post('/watch-history', protect, addToWatchHistory);

module.exports = router;
