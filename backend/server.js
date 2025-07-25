require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URI,
    credentials: true,
  })
);

// Routes
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/document", documentRoutes);

// Start server
const PORT = process.env.PORT || 8080;

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
