const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const cloudinary = require("../config/cloudinary");

const User = require("../models/User");
const Document = require("../models/Document");

// @desc   Register a new user
// @route  POST /api/v1/auth/register
// @access Public
const registerUser = async (req, res) => {
  const { name, email, password, avatarUrl } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    avatarUrl,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(201).json({
    message: "User registered successfully",
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
    },
    token,
  });
};

// @desc   Login user
// @route  POST/api/v1/auth/login
// @access Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "No user found, please sign up!" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  return res.status(200).json({
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    token,
  });
};

// @desc   Get User profile
// @route  GET/api/v1/auth/profile
// @access Private
const getMe = async (req, res) => {
  res.status(200).json({
    user: req.user,
  });
};

// @desc   Delete User profile
// @route  Delete/api/v1/auth/deleteProfile
// @access Private
const deleteProfile = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Step 1: Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Step 2: Get all documents owned by the user
    const userDocuments = await Document.find({ owner: userId });

    // Step 3: Delete documents from MongoDB
    await Document.deleteMany({ owner: userId });

    return res.status(200).json({
      message: "User, documents, and Cloudinary files deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting profile and documents:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  deleteProfile,
};
