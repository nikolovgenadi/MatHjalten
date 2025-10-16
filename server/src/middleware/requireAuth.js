import jwt from "jsonwebtoken";

// for protected routes

export function requireAuth(req, res, next) {
  const token = req.cookies?.auth;
  if (!token) return res.status(401).json({ error: "not authenticated" });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}
