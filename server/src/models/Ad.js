import mongoose from "mongoose";

const adSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, trim: true, required: true },
    expiresAt: { type: Date, required: true },
    status: { type: String, enum: ["available", "reserved", "unavailable"], default: "available" },
    locationText: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: false }, // optional
  },
  { timestamps: true }
);

export const Ad = mongoose.model("Ad", adSchema);
