const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const [tasks] = await db.query("SELECT * FROM tasks ORDER BY created_at DESC");
  res.json(tasks);
});

router.post("/", authMiddleware, async (req, res) => {
  const { title, description, assignee, dueDate, priority, status } = req.body;

  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  await db.query(
    `INSERT INTO tasks 
    (title, description, assignee, due_date, priority, status, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || "",
      assignee || "",
      dueDate || "",
      priority || "Medium",
      status || "todo",
      req.user.id,
    ]
  );

  req.app.get("io").emit("tasksUpdated");
  res.json({ message: "Task created successfully" });
});

router.put("/:id", authMiddleware, async (req, res) => {
  const { title, description, assignee, dueDate, priority, status } = req.body;

  const [tasks] = await db.query("SELECT * FROM tasks WHERE id = ?", [
    req.params.id,
  ]);

  if (tasks.length === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  const task = tasks[0];

  if (req.user.role !== "admin" && task.created_by !== req.user.id) {
    return res.status(403).json({ message: "You can update only your own tasks" });
  }

  await db.query(
    `UPDATE tasks 
     SET title=?, description=?, assignee=?, due_date=?, priority=?, status=?
     WHERE id=?`,
    [
      title,
      description,
      assignee,
      dueDate,
      priority,
      status,
      req.params.id,
    ]
  );

  req.app.get("io").emit("tasksUpdated");
  res.json({ message: "Task updated successfully" });
});

router.delete("/:id", authMiddleware, async (req, res) => {
  const [tasks] = await db.query("SELECT * FROM tasks WHERE id = ?", [
    req.params.id,
  ]);

  if (tasks.length === 0) {
    return res.status(404).json({ message: "Task not found" });
  }

  const task = tasks[0];

  if (req.user.role !== "admin" && task.created_by !== req.user.id) {
    return res.status(403).json({ message: "You can delete only your own tasks" });
  }

  await db.query("DELETE FROM tasks WHERE id = ?", [req.params.id]);

  req.app.get("io").emit("tasksUpdated");
  res.json({ message: "Task deleted successfully" });
});

module.exports = router;