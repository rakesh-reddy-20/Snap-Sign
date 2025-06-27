const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const isAuthorized = require("../middleware/authMiddleware");

// Controllers
const {
  registerUser,
  loginUser,
  getMe,
  deleteProfile,
} = require("../controllers/authController");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/authValidation");

// Auth Routes
router.post("/register", signupValidation, wrapAsync(registerUser)); // Register User
router.post("/login", loginValidation, wrapAsync(loginUser)); // Login User
router.get("/profile", isAuthorized, wrapAsync(getMe)); // Get profile
router.delete("/deleteProfile", isAuthorized, wrapAsync(deleteProfile));

module.exports = router;
