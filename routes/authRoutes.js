const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');  // Make sure this path is correct

// Make sure you have the correct controller method for the route
router.post('/register', authController.register);

module.exports = router;
