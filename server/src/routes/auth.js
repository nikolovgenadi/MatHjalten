import { Router } from "express";
import bcrypt from "bcryptjs";
import z from "zod";
import { User } from "../models/User.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/auth.js";
import mongoose from "mongoose";

const router = Router();

// register schema
const registerSchema = z
  .object({
    name: z.string().min(2).max(60),
    email: z.string().email(),
    password: z.string().min(6).max(100),
    confirmPassword: z.string().min(6).max(100),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// login schema
const loginSchema = z.object({
  email: z.string().email(),
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
