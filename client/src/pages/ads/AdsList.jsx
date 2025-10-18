import { useEffect, useState } from "react";

export default function AdsList() {
  const [items, setItems] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const url = import.meta.env.PROD ? "/api/ads" : "http://localhost:8080/api/ads";
    setMsg("loading...");
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setMsg("");
      })
      .catch(() => setMsg("failed to load"));
  }, []);

  if (msg) return <p className="text-center text-gray-500">{msg}</p>;

  return (
    <div style={{ padding: 20 }}>
      <ul>
        {items.map((a) => (
          <li key={a.id}>
            <a href={`/ads/${a.id}`}>{a.title}</a>{" "}
            <small>
              ({a.category || "uncategorized"}, . {a.locationText})
            </small>
          </li>
        ))}
      </ul>
      {!items.length && !msg && <p>No food to be saved yet.</p>}
    </div>
  );
}
