import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   GET /api/user/profile
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;