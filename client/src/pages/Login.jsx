import { useState } from "react";
import { useAuth } from "../hooks/useAuth.js";

export default function Login({ onSuccess }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { checkAuth } = useAuth();

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
    const data = await res.json();
    if (!res.ok) return setMsg(data.error || "an error occured");
    setMsg(`welcome back ${data.user.name}!`);
    // refresh the auth state
    await checkAuth();
    // redirect to main view after successful login
    setTimeout(() => {
      onSuccess && onSuccess();
    }, 1500); // small delay to show the welcome message
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>
      </form>
      {msg && <p className="mt-4 text-center text-sm text-gray-600">{msg}</p>}
    </div>
  );
}
