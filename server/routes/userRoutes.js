const express = require("express");
const db = require("../db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Only admin can access this" });
  }
  next();
}

router.get("/", authMiddleware, adminOnly, async (req, res) => {
  const [users] = await db.query(
    "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
  );

  res.json(users);
});

router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  const { role } = req.body;

  if (!["admin", "member"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  await db.query("UPDATE users SET role = ? WHERE id = ?", [role, req.params.id]);

  req.app.get("io").emit("usersUpdated");
  res.json({ message: "User role updated" });
});

router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: "You cannot delete yourself" });
  }

  await db.query("DELETE FROM tasks WHERE created_by = ?", [req.params.id]);
  await db.query("DELETE FROM users WHERE id = ?", [req.params.id]);

  req.app.get("io").emit("usersUpdated");
  req.app.get("io").emit("tasksUpdated");

  res.json({ message: "User deleted" });
});

module.exports = router;