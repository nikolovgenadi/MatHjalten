import { Router } from "express";
import mongoose from "mongoose";
const router = Router();

router.get("/", (_req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  res.json({
    ok: true,
    service: "MatHjalten API",
    db: states[mongoose.connection.readyState] ?? "unknown",
    timestamp: new Date().toISOString(),
  });
});

export default router;
