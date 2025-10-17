import { useEffect, useState } from "react";

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const url = import.meta.env.PROD ? "/api/ads/mine" : "http://localhost:8080/api/ads/mine";
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAds(data.items || []);
      })
      .catch(() => setMsg("failed to load"));
  }, []);

  async function del(id) {
    if (!confirm("delete this ad?")) return;
    const url = import.meta.env.PROD ? `/api/ads/${id}` : `http://localhost:8080/api/ads/${id}`;
    const res = await fetch(url, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      setAds(ads.filter((ad) => ad.id !== id));
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>My Ads</h1>
      {msg && <p>{msg}</p>}
      {ads.map((ad) => (
        <div key={ad.id} style={{ marginBottom: 10, borderBottom: "1px solid #000000ff" }}>
          {ad.title} <br />
          {ad.locationText}
          <button onClick={() => (window.location.href = `/ads/${ad.id}`)}>View</button>
          <button onClick={() => del(ad.id)}>Delete</button>
        </div>
      ))}
      {!ads.length && !msg && <p>No ads yet.</p>}
    </div>
  );
}
