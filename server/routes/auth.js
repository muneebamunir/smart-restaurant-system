const express = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = config.users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  if (password !== user.password) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const token = jwt.sign(
    { role: user.role, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    role: user.role
  });
});

module.exports = router;
