import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

// ===============================
// LOAD ENV
// ===============================
dotenv.config();

// ===============================
// IMPORT ROUTES
// ===============================
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import protectedRoutes from "./routes/protected.js";
import userRoutes from "./routes/user.routes.js";

// ===============================
// INIT APP
// ===============================
const app = express();

// ===============================
// MIDDLEWARES
// ===============================
app.use(
  cors({
    origin: "*", // ✅ allow Render + Vercel + localhost
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/user", userRoutes);

// ===============================
// HEALTH CHECK
// ===============================
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// ===============================
// ENV VALIDATION
// ===============================
const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("❌ JWT_SECRET missing");
  process.exit(1);
}

// ===============================
// DATABASE + SERVER
// ===============================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });