import { useEffect, useState } from "react"; // React built-in hooks
import { Link } from "react-router-dom";
import { useAuth } from "./hooks/useAuth.js";

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);
  const user = useAuth();

  useEffect(() => {
    const url = import.meta.env.PROD ? "/api/health" : "http://localhost:8080/api/health";

    fetch(url, { credentials: "include" })
      .then((r) => r.json())
      .then(setHealth)
      .catch((err) => {
        setError(err.message);
        setHealth({ ok: false, error: "server unavailable" });
      });
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <h1>MatHjälten</h1>
      <p>
        {user ? (
          <>
            Welcome {user.name}! · <Link to="/ads/mine">My Ads</Link> ·{" "}
            <Link to="/ads/new">Post new Ad</Link>
          </>
        ) : (
          <>
            <Link to="/register">Register</Link> · <Link to="/login">Login</Link>
          </>
        )}
      </p>
      <h2>Server health</h2>
      {error && <p style={{ color: "crimson" }}>⚠️ {error}</p>}
      <pre>{health ? JSON.stringify(health, null, 2) : "Loading..."}</pre>
    </div>
  );
}
