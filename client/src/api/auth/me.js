const API = import.meta.env.PROD ? "/api/auth" : "http://localhost:8080/api/auth";

export async function getMe() {
  const res = await fetch(`${API}/me`, { credentials: "include" });
  return res.json();
}
