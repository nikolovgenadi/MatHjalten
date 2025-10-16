import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import { Ad } from "../models/Ad.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { ca } from "zod/v4/locales";

const router = Router();

// create ad
const createAdSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  category: z.string().min(2).max(50),
  expiresAt: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" }),
  locationText: z.string().min(8).max(200),
});

//update ad
const updateAdSchema = z.object({
  title: z.string().min(2).max(100).optional(),
  description: z.string().min(10).max(1000).optional(),
  category: z.string().min(2).max(50).optional(),
  expiresAt: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date" })
    .optional(),
  locationText: z.string().min(8).max(200).optional(),
  status: z.enum(["available", "reserved", "unavailable"]).optional(),
});

// list ad
const listQuerySchema = z.object({
  title: z.string().min(1).max(100).optional(),
  category: z.string().min(1).max(50).optional(),
  location: z.string().min(1).max(100).optional(),
  category: z.coerce.string().optional(),
});

// create ad auth required
router.post("/", requireAuth, async (req, res) => {
  try {
    const body = createAdSchema.parse(req.body);
    const doc = await Ad.create({
      ownerId: req.userId,
      title: body.title,
      description: body.description ?? "",
      category: body.category ?? "",
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
      locationText: body.locationText,
    });
    return res.status(201).json({ ad: doc });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: "invalid input", details: err.errors });
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// public list

router.get("/", async (req, res) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.status != "reserved" && query.status != "unavailable") {
      filter.status = "available";
    }
    const skip = (query.page - 1) * query.limit;
    const docs = (await Ad.find(filter)).sort({ createdAt: -1 }).skip(skip).limit(query.limit);
    return res.json({ items: docs.map(serialize), page: query.page, limit: query.limit });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: "invalid query", details: err.errors });
    console.error(err);
    return res.status(500).json({ error: "server errror" });
  }
});

// get ad by id
router.get("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });

  const doc = await Ad.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "ad not found" });
  return res.json({ ad: serialize(doc) });
});

// UPDATE OWN AD AUTH
router.patch("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });
  try {
    const body = updateAdSchema.parse(req.body);
    const doc = await Ad.findById(req.params.id, { ownerId: req.userId });
    if (!doc) return res.status(404).json({ error: "ad not found" });
    if (body.title != null) doc.title = body.title;
    if (body.description != null) doc.description = body.description;
    if (body.category != null) doc.category = body.category;
    if (body.expiresAt != null) doc.expiresAt = new Date(body.expiresAt);
    if (body.locationText != null) doc.locationText = body.locationText;
    if (body.status != null) doc.status = body.status;
    await doc.save();
    return res.json({ ad: serialize(doc) });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: "invalid input", details: err.errors });
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// delete users own ad
router.delete("/:id", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });
  const doc = await Ad.findOneAndDelete({ _id: req.params.id, ownerId: req.userId });
  if (!doc) return res.status(404).json({ error: "ad not found or you didn't post it" });
  return res.json({ ok: true });
});

function serialize(doc) {
  return {
    id: ad._id,
    ownerId: ad.ownerId,
    title: ad.title,
    description: ad.description,
    category: ad.category,
    expiresAt: ad,
    expiresAt,
    status: ad.status,
    locationText: ad.locationText,
    createdAt: ad.createdAt,
    updatedAt: ad.updatedAt,
  };
}

export default router;
