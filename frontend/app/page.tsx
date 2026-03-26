"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "dark";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const jwt = localStorage.getItem("token");

      if (!jwt) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (res.ok) {
          router.replace("/dashboard");
          return;
        } else {
          localStorage.removeItem("token");
        }
      } catch {
        localStorage.removeItem("token");
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-secondary">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center text-center px-6">

      {/* NAVBAR */}
      <nav className="w-full max-w-6xl flex justify-between items-center py-6">
        <h1 className="text-lg font-semibold tracking-wide text-primary">
          UR-LinKs
        </h1>

        <div className="flex items-center gap-6 text-sm text-secondary">

          <button
            className="hover:text-primary transition"
            onClick={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Features
          </button>

          <button
            className="hover:text-primary transition"
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            About
          </button>

          {/* ✅ THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur text-xs hover:bg-white/20 transition"
          >
            {theme === "dark" ? "Dark" : "Light"}
          </button>

        </div>

        <button
          onClick={() => router.push("/login")}
          className="px-5 py-2 rounded-full bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
        >
          Login
        </button>
      </nav>

      {/* HERO */}
      <section className="mt-20 max-w-4xl">

        <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-primary">
          Smart URL Shortening
          <br />
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            With Analytics & Insights
          </span>
        </h1>

        <p className="mt-6 text-secondary text-base max-w-xl mx-auto">
          Create, manage, and track your links with a modern dashboard built for speed and simplicity.
        </p>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Get Started
          </button>
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="mt-32 w-full max-w-6xl">

        <h2 className="text-3xl font-semibold text-primary mb-10">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {[
            ["Custom Short Links", "Create branded and memorable short URLs with your own custom codes."],
            ["Real-time Analytics", "Monitor clicks, performance, and engagement with detailed analytics."],
            ["QR Code Generation", "Instantly generate QR codes for your links and share them anywhere."],
            ["Expiry Control", "Set expiration dates for links and manage their lifecycle easily."],
            ["Secure & Fast", "Built with modern technologies ensuring speed, security, and reliability."],
            ["Dashboard Control", "Manage all your links from a clean and intuitive dashboard."],
          ].map(([title, desc], i) => (
            <div
              key={i}
              className="glass-card p-6 rounded-2xl shadow-md hover:shadow-xl transition"
            >
              <h3 className="text-primary font-semibold mb-2">
                {title}
              </h3>
              <p className="text-secondary text-sm">
                {desc}
              </p>
            </div>
          ))}

        </div>

      </section>

      {/* DASHBOARD PREVIEW */}
      <section className="mt-32 w-full max-w-6xl">

        <div className="glass-strong rounded-3xl p-10">

          <h2 className="text-3xl font-semibold text-primary mb-8">
            Live Dashboard Preview
          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="glass-card p-5 space-y-4 text-sm">
              <div className="text-primary font-medium">Dashboard</div>

              <div className="space-y-2 text-secondary">
                <div className="flex justify-between">
                  <span>Total Links</span>
                  <span className="text-primary font-semibold">12</span>
                </div>

                <div className="flex justify-between">
                  <span>Total Clicks</span>
                  <span className="text-primary font-semibold">248</span>
                </div>

                <div className="flex justify-between">
                  <span>Active</span>
                  <span className="text-primary font-semibold">10</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 glass-card p-6">
              <div className="flex justify-between mb-4">
                <span className="text-primary font-medium">
                  Click Analytics
                </span>
                <span className="text-xs text-secondary">
                  Last 7 days
                </span>
              </div>

              <div className="h-44 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-end gap-2 p-3">
                {[30, 60, 40, 80, 55, 90, 70].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-blue-600 rounded-md"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* ABOUT */}
      <section id="about" className="mt-32 w-full max-w-6xl">
        <div className="glass-strong rounded-3xl p-10 md:p-14">

          <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center mb-10">
            About UR-LinKs
          </h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">

            <div className="text-left space-y-5">
              <p className="text-secondary text-sm leading-relaxed">
                UR-LinKs is a modern URL shortening platform designed to simplify
                link management while delivering powerful analytics.
              </p>

              <p className="text-secondary text-sm leading-relaxed">
                Whether you're a developer, marketer, or creator, it helps you
                track, optimize, and manage links with precision and ease.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              {[
                ["Fast Performance", "Optimized for speed and reliability."],
                ["Secure System", "Built with modern security standards."],
                ["Smart Insights", "Understand your audience better."],
                ["Easy to Use", "Clean and intuitive interface."],
              ].map(([title, desc], i) => (
                <div key={i} className="glass-card p-4 rounded-xl">
                  <h4 className="text-primary font-semibold text-sm">
                    {title}
                  </h4>
                  <p className="text-secondary text-xs mt-1">
                    {desc}
                  </p>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="mt-32 w-full max-w-4xl">
        <div className="glass-strong rounded-3xl p-10 text-center">

          <h2 className="text-2xl font-semibold text-primary mb-4">
            Ready to get started?
          </h2>

          <p className="text-secondary mb-6 text-sm">
            Start shortening and tracking your links today.
          </p>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
          >
            Start Now
          </button>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 mb-6 text-xs text-secondary">
        © 2026 UR-LinKs. All rights reserved.
      </footer>

    </div>
  );
}