"use client";

import { useState } from "react";

export default function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {

    setError("");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email }),
});

      if (!res.ok) {
        setError("Request failed");
        return;
      }

      setMessage("If account exists, reset link sent.");

    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white dark:bg-zinc-900 shadow-xl p-8 rounded-xl flex flex-col gap-4 w-96">

        <h1 className="text-xl font-bold">
          Forgot Password
        </h1>

        <input
          type="email"
          placeholder="Enter email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white py-2 rounded"
        >
          Send Reset Link
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

      </div>
    </div>
  );
}