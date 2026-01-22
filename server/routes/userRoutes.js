const express = require('express');
const router = express.Router();
const { toggleLike } = require('../controllers/userController');

// Route to toggle book likes
router.post('/toggle-like', toggleLike);

module.exports = router;