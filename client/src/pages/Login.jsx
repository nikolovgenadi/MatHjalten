import { useState } from "react";
import { login } from "../api/auth.js";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg("loading...");
    const url = import.meta.env.PROD ? "/api/auth/login" : "http://localhost:8080/api/auth/login";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });
    const data = await login(form.email, form.password);
    if (!res.ok) return setMsg(data.error || "an error occured");
    setMsg(`welcome back ${data.user.name}!`);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />{" "}
        <br />
        <input
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />{" "}
        <br />
        <button type="button">Login</button>
      </form>
      <p>{msg}</p>
    </div>
  );
}
