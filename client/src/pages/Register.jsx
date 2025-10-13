import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg("please wait...");
    const url = import.meta.env.PROD
      ? "/api/auth/register"
      : "http://localhost:8080/api/auth/register";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "an error occured");
    setMsg(`Welcome ${data.user.name}!`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input name="name" placeholder="name" value={form.name} onChange={onChange} required />
        <br />
        <input
          name="email"
          type="email"
          placeholder="email"
          value={form.email}
          onChange={onChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={form.password}
          onChange={onChange}
          required
        />
        <br />
        <input
          name="confirmPassword"
          type="password"
          placeholder="confirm password"
          value={form.confirmPassword}
          onChange={onChange}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
