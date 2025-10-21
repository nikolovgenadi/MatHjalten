// Main Express app: JSON parsing, cookies, (dev) CORS, API routes, and static client in prod
import "dotenv/config"; // loads .env into process.env
import express from "express"; // web server framework
import cookieParser from "cookie-parser"; // reads/writes cookies (for JWT)
import cors from "cors"; // only for local dev (frontend on another port)
import path from "node:path"; // Node core: path utils
import { fileURLToPath } from "node:url";
import { connectDB } from "./utils/db.js";
import healthRouter from "./routes/health.js";
import authRouter from "./routes/auth.js";
import adsRouter from "./routes/ads.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Core middleware
app.use(express.json()); // built-in body parser
app.use(cookieParser());

// Allow React dev server (http://localhost:5173) to call API in dev
if (process.env.NODE_ENV !== "production") {
  app.use(cors({ origin: "http://localhost:5173", credentials: true }));
}

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/health", healthRouter);
app.use("/api/auth", authRouter);
app.use("/api/ads", adsRouter);

// for production (dist)
const clientDistPath = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDistPath));
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

const PORT = process.env.PORT || 8080;

(async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error("✗ Failed to start server:", err.message);
    process.exit(1);
  }
})();
