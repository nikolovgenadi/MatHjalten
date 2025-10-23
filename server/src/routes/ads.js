import { Router } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import { Ad } from "../models/Ad.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { ca } from "zod/v4/locales";

const router = Router();

// Ensure uploads directory exists (bug fix+preventative)
const uploadsPath = path.join(process.cwd(), "uploads/ads/");
try {
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
} catch (err) {
  console.error("Warning: Could not create uploads directory:", err);
}

// multer config for image upload (built in fs,cb)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync("uploads/ads/")) {
        fs.mkdirSync("uploads/ads/", { recursive: true });
      }
      cb(null, "uploads/ads/");
    } catch (err) {
      console.error("Multer destination error:", err);
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    try {
      // generate unique filename to be saved: timestamp-userid-originalname
      const uniqueName = `${Date.now()}-${req.userId}-${file.originalname}`;
      cb(null, uniqueName);
    } catch (err) {
      console.error("Multer filename error:", err);
      cb(err);
    }
  },
});

const fileFilter = (req, file, cb) => {
  // only allow jpg and png files
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG and PNG images are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// create ad
const createAdSchema = z.object({
  title: z.string().min(2).max(100),
  description: z.string().min(10).max(1000),
  category: z.string().min(2).max(50),
  expiresAt: z.string().refine(
    (val) => {
      const date = new Date(val);
      return !isNaN(date.getTime()) && date > new Date();
    },
    { message: "Invalid date or date must be in the future" }
  ),
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
});

// create ad auth required with optional image upload
router.post("/", requireAuth, upload.single("image"), async (req, res) => {
  try {
    // when using FormData, all values = strings,so to validate them properly
    const body = createAdSchema.parse(req.body);
    console.log("creating ad for user:", req.userId);

    // build ad data
    const adData = {
      ownerId: new mongoose.Types.ObjectId(req.userId),
      title: body.title,
      description: body.description,
      category: body.category,
      expiresAt: new Date(body.expiresAt),
      locationText: body.locationText,
    };

    // Add image URL if file was uploaded
    if (req.file) {
      adData.imageUrl = `/uploads/ads/${req.file.filename}`;
    }
    // debug log
    const doc = await Ad.create(adData);
    console.log("Created ad:", doc._id, "for owner:", doc.ownerId);
    return res.status(201).json({ ad: serialize(doc) });
  } catch (err) {
    console.error("Error creating ad:", err);

    if (err instanceof z.ZodError) {
      console.error("Validation error:", err.errors);
      return res.status(400).json({ error: "invalid input", details: err.errors });
    }

    if (err.message === "Only JPEG and PNG images are allowed") {
      return res.status(400).json({ error: "Only JPEG and PNG images are allowed" });
    }

    // Multer errors
    if (err.code === "ENOENT") {
      console.error("File system error - directory doesn't exist");
      return res.status(500).json({ error: "File upload configuration error" });
    }

    // MongoDB errors
    if (err.name === "ValidationError") {
      console.error("MongoDB validation error:", err.message);
      return res.status(400).json({ error: "Database validation failed", details: err.message });
    }

    return res.status(500).json({
      error: "server error",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
});

// public list

router.get("/", async (req, res) => {
  try {
    const query = listQuerySchema.parse(req.query);
    const filter = {};
    if (query.category) filter.category = query.category;

    const docs = await Ad.find(filter).sort({ createdAt: -1 });
    return res.json({ items: docs.map(serialize) });
  } catch (err) {
    if (err instanceof z.ZodError)
      return res.status(400).json({ error: "invalid query", details: err.errors });
    console.error(err);
    return res.status(500).json({ error: "server errror" });
  }
});

// list ads for logged in user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    console.log("Fetching ads for user:", req.userId);
    const docs = await Ad.find({ ownerId: new mongoose.Types.ObjectId(req.userId) }).sort({
      createdAt: -1,
    });
    console.log("Found", docs.length, "ads for user:", req.userId);
    return res.json({ items: docs.map(serialize) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
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
router.patch("/:id", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });
  try {
    const body = updateAdSchema.parse(req.body);
    const doc = await Ad.findOne({
      _id: req.params.id,
      ownerId: new mongoose.Types.ObjectId(req.userId),
    });
    if (!doc) return res.status(404).json({ error: "ad not found or not yours" });
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

// reserve an ad - any authenticated user can reserve an available ad
router.patch("/:id/reserve", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });
  try {
    const doc = await Ad.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: "ad not found" });

    // Check if ad is available for reservation
    if (doc.status !== "available") {
      return res.status(400).json({ error: "ad is not available for reservation" });
    }

    // Update status to reserved
    doc.status = "reserved";
    await doc.save();

    return res.json({ ad: serialize(doc) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
});

// delete users own ad
router.delete("/:id", requireAuth, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(400).json({ error: "invalid id" });
  const doc = await Ad.findOneAndDelete({
    _id: req.params.id,
    ownerId: new mongoose.Types.ObjectId(req.userId),
  });
  if (!doc) return res.status(404).json({ error: "ad not found or you didn't post it" });
  return res.json({ ok: true });
});

function serialize(doc) {
  return {
    id: doc._id.toString(),
    ownerId: doc.ownerId.toString(),
    title: doc.title,
    description: doc.description,
    category: doc.category,
    expiresAt: doc.expiresAt,
    status: doc.status,
    locationText: doc.locationText,
    imageUrl: doc.imageUrl || null, // image URL if present
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export default router;
