require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoutes = require("./routes/userRoutes");
const todoRoutes = require("./routes/todoroute");

const app = express();

app.use(express.json());
app.use(cors());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todoRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("✅ Server is running!");
});

// MongoDB Connection with better error handling
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => {
  console.error("MongoDB connection error:", err);
  process.exit(1); // Exit with failure
});

// Use environment provided port or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));