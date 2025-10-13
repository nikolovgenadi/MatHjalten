const API = import.meta.env.PROD ? "/api/auth" : "http://localhost:8080/api/auth";

export async function register(name, email, password) {
  const res = await fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}
