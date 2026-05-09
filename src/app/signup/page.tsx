"use client";

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleSignup = async () => {
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data);
      setError(data.issues?.[0]?.message || data.error);
      return;
    }

    if (!data.success) {
      setError(data.error);
      return;
    }

    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="p-6 border rounded-xl space-y-4 w-80">
        <h1 className="text-xl font-semibold">Signup</h1>

        <input
          className="w-full border p-2 rounded"
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          className="w-full border p-2 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          className="w-full bg-black text-white p-2 rounded"
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
      <p className="text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-black hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
