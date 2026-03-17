"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPassword() {

  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const reset = async () => {

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!res.ok) {
        setError("Reset failed");
        return;
      }

      setMessage("Password updated");

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">

      <div className="bg-white dark:bg-zinc-900 shadow-xl p-8 rounded-xl flex flex-col gap-4 w-96">

        <h1 className="text-xl font-bold">
          Reset Password
        </h1>

        <input
          type="password"
          placeholder="New password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={reset}
          className="bg-black text-white py-2 rounded"
        >
          Reset Password
        </button>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

      </div>
    </div>
  );
}