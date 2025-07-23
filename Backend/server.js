import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import "./config/passport.js";               

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.set("trust proxy", 1);
app.use(express.json());

app.use(
  cors({
    origin: "https://cognig.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Global session + Passport initialization
app.use(
  session({
    name: "sessionId",
    secret: process.env.SESSION_SECRET || "keyboard cat",
    resave: false,
    saveUninitialized: false,
    cookie: {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use("/auth", authRoutes);
app.use("/api", chatRoutes);

// Global catch-all error handler (JSON only)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal Server Error",
    details: err.message || String(err),
  });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected with Database!"))
  .catch((err) => console.error("DB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
