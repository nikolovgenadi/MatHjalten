import { useEffect, useState } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const url = import.meta.env.PROD ? "api/auth/me" : "http://localhost:8080/api/auth/me";
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data.user || null))
      .catch(() => setUser(null));
  }, []);
  return user;
}
