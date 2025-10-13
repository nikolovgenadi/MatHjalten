const API = import.meta.env.PROD ? "/api/auth" : "http://localhost:8080/api/auth";

export async function logout() {
  const res = await fetch(`${API}/logout`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
}
