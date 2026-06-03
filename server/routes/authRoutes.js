const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const [existing] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (existing.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hashedPassword, role || "member"]
  );

  res.json({ message: "User registered successfully" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const [users] = await db.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);

  if (users.length === 0) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const user = users[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = router;