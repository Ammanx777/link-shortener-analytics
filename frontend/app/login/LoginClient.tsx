"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginClient() {

  const router = useRouter();
  const { status, data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 🔥 CRITICAL FIX: ensure JWT is created BEFORE redirect
  useEffect(() => {

    const run = async () => {

      if (status !== "authenticated") return;

      // 🔍 Check if token already exists
      const existingToken = localStorage.getItem("token");

      if (existingToken) {
        router.replace("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: session?.user?.email
          })
        });

        const data = await res.json();

        console.log("Google → JWT response:", data);

        if (!data.token) {
          console.error("NO TOKEN RECEIVED");
          return;
        }

        localStorage.setItem("token", data.token);

        // 🔥 ONLY redirect AFTER token exists
        router.replace("/");

      } catch (err) {
        console.error("Google sync failed:", err);
      }
    };

    run();

  }, [status, session, router]);

  // normal login
  const login = async () => {

    setError("");

    try {
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      router.replace("/");

    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-xl p-8 flex flex-col gap-4">

      <h1 className="text-2xl font-bold text-center">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={login} className="bg-black text-white py-2">
        Login
      </button>

      <div className="text-center text-sm">OR</div>

      <button
        onClick={() => signIn("google")}
        className="bg-red-500 text-white py-2"
      >
        Continue with Google
      </button>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}