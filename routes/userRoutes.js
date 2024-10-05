// routes/userRoutes.js
const express = require('express');
const { registerUser, loginUser, getProtectedData, getAllUsers,addNameToList, getUserNames, removeNameFromList } = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route (requires JWT token)
router.get('/users', auth, getAllUsers)
router.get('/protected', auth, getProtectedData);

// Add a name to the current user's list
router.post('/names', auth, addNameToList);

// Get all names for the current user
router.get('/names', auth, getUserNames);

// Remove a name from the current user's list
router.delete('/names', auth, removeNameFromList);

module.exports = router;

