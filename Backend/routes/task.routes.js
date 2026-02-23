import express from "express";
import Task from "../models/Task.js";
import auth from "../middleware/auth.middleware.js";

const router = express.Router();

/* =====================================================
   GET /api/tasks
   - Search by title (query: search)
   - Filter by completed status (query: completed=true/false)
   - Pagination (query: page & limit)
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const { search, completed } = req.query;

    // Build filter
    const filter = { userId: req.user.id };
    if (search) filter.title = { $regex: search, $options: "i" };
    if (completed !== undefined) filter.completed = completed === "true";

    // Fetch tasks and total count
    const [tasks, total] = await Promise.all([
      Task.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      data: tasks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ TASK FETCH ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   CREATE TASK
   POST /api/tasks
===================================================== */
router.post("/", auth, async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Task title is required" });
    }

    const task = await Task.create({
      title: title.trim(),
      userId: req.user.id,
      completed: false,
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("❌ TASK CREATE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   UPDATE TASK
   PUT /api/tasks/:id
   - Edit title or toggle completed
===================================================== */
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, completed } = req.body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (completed !== undefined) update.completed = completed;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      update,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (err) {
    console.error("❌ TASK UPDATE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE TASK
   DELETE /api/tasks/:id
===================================================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("❌ TASK DELETE ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;