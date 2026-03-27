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
  const [theme, setTheme] = useState("dark");
  const [loading, setLoading] = useState(true);

  // THEME INIT
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  // 🔥 MAIN AUTH HANDLER (FIXED)
  useEffect(() => {
    const handleAuth = async () => {
      if (status === "loading") return;

      const existingToken = localStorage.getItem("token");

      // ✅ If already logged in → go dashboard
      if (existingToken) {
        router.replace("/dashboard"); // IMPORTANT
        return;
      }

      // ✅ If Google authenticated → exchange token
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google-login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.token) {
            setError("Google login failed");
            setLoading(false);
            return;
          }

          localStorage.setItem("token", data.token);

          // 🔥 DIRECT DASHBOARD REDIRECT (NO LANDING PAGE)
          router.replace("/dashboard");
          return;
        } catch (err) {
          console.error(err);
          setError("Google login error");
        }
      }

      setLoading(false);
    };

    handleAuth();
  }, [status, session, router]);

  // NORMAL LOGIN
  const login = async () => {
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
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

      // 🔥 FIX: go directly to dashboard
      router.replace("/dashboard");
    } catch {
      setError("Server error");
    }
  };

  // LOADING STATE (IMPORTANT)
  if (loading) {
    return (
      <div className="flex items-center justify-center w-full">
        Loading...
      </div>
    );
  }

  return (
    <>
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 glass px-4 py-2 rounded-full text-xs text-primary"
      >
        {theme === "dark" ? "Dark" : "Light"}
      </button>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-primary text-center">
          Welcome Back
        </h2>

        <p className="text-sm text-secondary text-center">
          Login to continue to your dashboard
        </p>

        <input
          type="email"
          placeholder="Email"
          className="glass input-glass rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="glass input-glass rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="btn-glass font-medium">
          Login
        </button>

        <div className="flex items-center gap-3 text-xs text-muted">
          <div className="flex-1 h-[1px] bg-black/10 dark:bg-white/20" />
          OR
          <div className="flex-1 h-[1px] bg-black/10 dark:bg-white/20" />
        </div>

        <button
            onClick={() => signIn("google", { callbackUrl: "/login" })} // IMPORTANT
          className="glass flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-primary hover:scale-[1.02] transition"
        >
          Continue with Google
        </button>

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}
      </div>
    </>
  );
}