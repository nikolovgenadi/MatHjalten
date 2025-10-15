import mongoose from "mongoose";

// ad chema
const adSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, trim: true, required: true },
    expiresAt: { type: Date, required: true },
    // maybe ill add it later, idk if i want it now createdAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["available", "reserved", "unavailable"], default: "available" },
    locationText: { type: String, required: true, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

export const Ad = mongoose.model("Ad", adSchema);
