const jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyToken = (roles = []) => {
  return async (req, res, next) => {
    const header = req.headers["authorization"];

    if (!header) {
      return res.status(403).json({ message: "No token" });
    }

    const token = header.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findOne({ username: decoded.username });

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (user.role !== decoded.role) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = {
        id: user._id,
        username: user.username,
        role: user.role
      };

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = verifyToken;
