import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdDetail() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const url = import.meta.env.PROD ? `/api/ads/${id}` : `http://localhost:8080/api/ads/${id}`;
    fetch(url, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setAd(data.ad);
      })
      .catch(() => setMsg("failed to load"));
  }, [id]);

  if (!ad) return <div>{msg || "loading..."}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1>{ad.title}</h1>
      <p>{ad.description}</p>
      <p>Category: {ad.category || "-"}</p>
      <br />
      <p>Expires At: {ad.expiresAt}</p> <br />
      <p>Status: {ad.status}</p> <br />
      <p>Location: {ad.locationText}</p> <br />
      <small>Created: {new Date(ad.createdAt).toLocaleString()}</small>
    </div>
  );
}
