require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Middleware
app.use(express.json());

// Routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

// Start server
const PORT = process.env.PORT || 8080;

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/document", documentRoutes);

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
