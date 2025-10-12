import { Router } from "express";
import bcrypt from "bcryptjs";
import z from "zod";
import User from "../models/User.js";
import { signToken, setAuthCookie, clearAuthCookies } from "../utils/jwt.js";
import mongoose from "mongoose";

const router = Router();

// register schema
const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  }),
  password: z.string().min(6).max(100),
});

// login schema
const loginSchema = z.object({
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address",
  }),
  password: z.string().min(6).max(100),
});
//REGISTER ROUTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body);
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: "Email already in use" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user._id.toString());
    setAuthCookie(res, token);
    return res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: err.errors });
    }
    //UNIQUE
    if (err.code === 11000) return res.status(409).json({ error: "Email already in use" });
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// LOGIN ROYUTER
router.post("/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "invalid credentials" });

    const token = signToken(user._id.toString());
    setAuthCookie(res, token);
    return res.json({ user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: "invalid input", details: err.errors });
    }
    console.log(err);
    return res.status(500).json({ error: "server error", details: err.errors });
  }
});

// router me for current user
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.auth;
    if (!token) return res.status(200).json({ user: null });

    const { sub } = await (async () => {
      try {
        return jwtVerify(token);
      } catch {
        return {};
      }
    })();

    if (!sub || !mongoose.isValidObjectId(sub)) return res.status(200).json({ user: null });
    const user = await User.findById(sub).select("_id name email");
    return res.json({ user: user ? { id: user._id, name: user.name, email: user.email } : null });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "server error" });
  }
});

// logout router
router.post("/logout", (_req, res) => {
  clearAuthCookies(res);
  return res.json({ ok: true });
});

async function jwtVerify(token) {
  const jwt = await import("jsonwebtoken");
  return jwt.default.verify(token, process.env.JWT_SECRET);
}

export default router;
