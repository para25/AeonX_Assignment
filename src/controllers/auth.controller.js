// src/controllers/auth.controller.js
const User = require("../models/user.model");
const { generateToken } = require("../utils/token.util");


//  * POST /api/auth/register
async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: { message: "Missing required fields" } });
    }

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: { message: "Email already in use" } });
    }

    const user = new User({ name, email, password, role });
    await user.save();

    const token = generateToken({ userId: user._id, role: user.role });

    const userResp = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.status(201).json({ data: { user: userResp, token } });
  } catch (err) {
    next(err);
  }
}


//  * POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: { message: "Missing email or password" } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: { message: "Invalid credentials" } });
    }

    const token = generateToken({ userId: user._id, role: user.role });

    const userResp = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    res.json({ data: { user: userResp, token } });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
