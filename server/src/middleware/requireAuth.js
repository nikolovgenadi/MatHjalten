import jwt from "jsonwebtoken";

// appratenly will need for protected routes later

export function requireAuth(req, res, next) {
  const token = req.cookies?.auth;
  if (!token) return res.status(401).json({ error: "not authenticated yo" });
  try {
    const payload = JsonWebTokenError.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "invalid token" });
  }
}
