import { useState } from "react";

export default function NewAd() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    expiresAt: "",
    locationText: "",
  });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg("loading...");
    const url = import.meta.env.PROD ? "/api/ads" : "http://localhost:8080/api/ads";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        category: form.category,
        expiresAt: form.expiresAt,
        locationText: form.locationText,
      }),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "an error occured");
    setMsg("created ad");
    window.location.href = `/ads/${data.ad.id}`;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Create New Ad</h1>
      <form onSubmit={submit}>
        <input type="text" name="title" placeholder="Title" onChange={onChange} required />
        <br />
        <textarea name="description" placeholder="Description" onChange={onChange} required />
        <br />
        <input type="text" name="category" placeholder="Category" onChange={onChange} required />
        <br />
        <input type="date" name="expiresAt" onChange={onChange} required />
        <br />
        <input
          type="text"
          name="locationText"
          placeholder="Pick-up address (city, street)"
          onChange={onChange}
          required
        />
        <br />
        <button type="submit">Create Ad</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
