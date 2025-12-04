// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET || "change-this-secret";

// verifyToken middleware: attaches `req.user = { id, role }`
async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ error: { message: "No token provided" } });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    // optionally fetch user from DB to ensure still exists
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ error: { message: "Invalid token (user not found)" } });
    }

    req.user = { id: user._id, role: user.role };
    next();
  } catch (err) {
    console.error("Auth verify error:", err.message);
    return res.status(401).json({ error: { message: "Unauthorized" } });
  }
}

// authorizeRoles middleware: ensure user role present in allowed list
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: { message: "Unauthorized" } });

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: { message: "Forbidden: insufficient role" } });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles,
};
