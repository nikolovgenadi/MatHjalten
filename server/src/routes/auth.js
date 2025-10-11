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
