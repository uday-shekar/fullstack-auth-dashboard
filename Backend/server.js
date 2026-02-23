import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// 🔥 LOAD ENV FIRST
dotenv.config();

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import protectedRoutes from "./routes/protected.js";
import userRoutes from "./routes/user.routes.js";
import authMiddleware from "./middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

export default router;


const app = express();

/* ===============================
   MIDDLEWARES
================================ */
app.use(
  cors({
    origin: "http://localhost:5173", // frontend Vite URL
    credentials: true,
  })
);
app.use(express.json());

/* ===============================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/user", userRoutes);

// 🔍 Health check (debug helper)
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

/* ===============================
   DATABASE + SERVER
================================ */
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in .env");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing in .env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });