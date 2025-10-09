import jwt from "jsonwebtoken";

const isProduction = process.env.NODE_ENV === "production";

// signed jwt user id
export function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// jwt htttonly cookie
export function setAuthCookie(res, token) {
  res.cookie("auth", token, {
    httpOnly: true,
    secure: isProduction, // only over https in prod
    sameSite: isProduction ? "lax" : "lax", // cross-site in prod (React on another host)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

// clear cookie
export function clearAuthCookies(res) {
  res.clearCookie("auth", { path: "/" });
}
