import { useEffect, useState } from "react"; // React built-in hooks
import './App.css'

export default function App() {
  const [health, setHealth] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = import.meta.env.PROD
      ? "/api/health"                      // prod: same origin (served by Express)
      : "http://localhost:8080/api/health"; // dev: API runs on :8080

    fetch(url, { credentials: "include" })
      .then((r) => r.json())
      .then(setHealth)
      .catch(setError);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <h1>MatHjälten</h1>
      <p>Fullstack PWA — React + Express + MongoDB</p>
      <hr />
      <h2>Server health</h2>
      {error && <pre style={{ color: "crimson" }}>{String(error)}</pre>}
      <pre>{health ? JSON.stringify(health, null, 2) : "Loading..."}</pre>
    </div>
  );
}
