const express = require('express');
const { addMovie, updateMovie, deleteMovie, getAllCustomMovies, getAllUsers, banUser, deleteUser } = require('../controllers/admin.controller');
const { protect, admin } = require('../middleware/auth.middleware');

const router = express.Router();

// Apply protect and admin middleware to all admin routes
router.use(protect, admin);

// Movie Management Routes
router.get('/movies', getAllCustomMovies);
router.post('/movies', addMovie);
router.put('/movies/:id', updateMovie);
router.delete('/movies/:id', deleteMovie);

// User Management Routes
router.get('/users', getAllUsers);
router.put('/users/:id/ban', banUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
