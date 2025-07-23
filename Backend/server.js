import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.set('trust proxy', 1);
app.use(express.json());

const corsOptions = {
  origin: "https://cognig.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));


app.use("/auth", authRoutes);

app.use("/api", cors(corsOptions), chatRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected with Database!"))
  .catch((err) => console.error("DB connection error:", err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
