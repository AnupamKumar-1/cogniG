// server.js
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

app.use(express.json());

 app.use(
   cors({
     origin: "http://localhost:5173",
     credentials: true
   })
 );

app.use("/auth", authRoutes);
// Mount all /api routes (history  chat)
app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected with Database!"))
    .catch((err) => console.error("DB connection error:", err));
});
