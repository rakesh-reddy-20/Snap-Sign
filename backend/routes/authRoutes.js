const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const protect = require("../middleware/authMiddleware");

// Controllers
const {
  registerUser,
  loginUser,
  getMe,
} = require("../controllers/authController");

// Auth Routes
router.post("/register", wrapAsync(registerUser)); // Register User
router.post("/login", wrapAsync(loginUser)); // Login User
router.get("/me", protect, getMe); // Get profile

module.exports = router;
