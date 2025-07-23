import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

console.log("GEMINI_API_KEY is", process.env.GEMINI_API_KEY ? "set" : "MISSING");

const app = express();
const PORT = process.env.PORT || 8080;

app.set('trust proxy', 1);
app.use(express.json());

app.use(
  cors({
    origin: "https://cognig.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

app.use("/auth", authRoutes);
app.use("/api", chatRoutes);

// Global catch-all error handler (must come *after* all routes)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message || String(err)
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected with Database!"))
  .catch((err) => console.error("DB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
