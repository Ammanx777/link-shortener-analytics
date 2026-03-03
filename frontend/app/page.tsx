"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Load token on mount
 useEffect(() => {
  const verifyToken = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const res = await fetch("http://localhost:5000/me", {
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    });

    if (!res.ok) {
      localStorage.removeItem("token");
      router.push("/login");
    } else {
      setToken(storedToken);
    }
  };

  verifyToken();
}, []);

  useEffect(() => {
    if (token) {
      fetchLinks();
    }
  }, [token]);

  useEffect(() => {
    if (!selectedCode || !token) return;

    const interval = setInterval(() => {
      fetchAnalytics(selectedCode);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedCode, token]);

  const login = async () => {
  setError("");

  try {
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      return;
    }

    localStorage.setItem("token", data.token);
    setToken(data.token);

  } catch {
    setError("Login failed");
  }
};

  const fetchLinks = async () => {
    if (!token) return;

    const res = await fetch("http://localhost:5000/links", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setLinks(data);
  };

  const createShortUrl = async () => {
    if (!token) {
      setError("Please login first");
      return;
    }

    setError("");

    try {
      const res = await fetch("http://localhost:5000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url,
          customCode: customCode || undefined,
          expiresAt: expiresAt
            ? new Date(expiresAt).toISOString()
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setUrl("");
      setCustomCode("");
      setExpiresAt("");
      fetchLinks();

    } catch {
      setError("Server error");
    }
  };

  const fetchAnalytics = async (shortCode: string) => {
    if (!token) return;

    const res = await fetch(
      `http://localhost:5000/analytics/${shortCode}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await res.json();
    setAnalytics(data);
    setSelectedCode(shortCode);
  };

  const deleteLink = async (id: number) => {
    if (!token) return;

    await fetch(`http://localhost:5000/links/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setAnalytics(null);
    setSelectedCode(null);
    fetchLinks();
  };

  let chartData;

  if (analytics) {
    const grouped: { [key: string]: number } = {};

    analytics.clicksData.forEach((click: any) => {
      const date = new Date(click.createdAt).toLocaleDateString();
      grouped[date] = (grouped[date] || 0) + 1;
    });

    chartData = {
      labels: Object.keys(grouped),
      datasets: [
        {
          label: "Daily Clicks",
          data: Object.values(grouped),
          borderColor: "rgb(75, 192, 192)",
          tension: 0.3,
        },
      ],
    };
  }

  if (!token) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Login</h1>

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-64"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-64"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="bg-black text-white px-6 py-2"
      >
        Login
      </button>
      

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">
        URL Shortener Dashboard
      </h1>

      <button
  onClick={() => {
    localStorage.removeItem("token");
    setToken(null);
  }}
  className="bg-red-600 text-white px-4 py-1"
>
  Logout
</button>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter full URL (https://...)"
          className="border p-2 w-96"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <input
          type="text"
          placeholder="Custom short code (optional)"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="border p-2"
        />

        <input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
          className="border p-2"
        />

        <button
          onClick={createShortUrl}
          className="bg-black text-white px-4"
        >
          Generate
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-2">
        Your Links
      </h2>

      <table className="w-full border text-sm mb-8">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">Original</th>
            <th className="p-2 text-left">Short URL</th>
            <th className="p-2 text-left">Clicks</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr key={link.id} className="border-b">
              <td className="p-2">{link.original}</td>
              <td className="p-2">
                <a
                  href={`http://localhost:5000/${link.shortCode}`}
                  target="_blank"
                  className="text-blue-600 underline"
                >
                  {link.shortCode}
                </a>
              </td>
              <td className="p-2">{link.clicks}</td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => fetchAnalytics(link.shortCode)}
                  className="bg-gray-800 text-white px-3 py-1 text-xs"
                >
                  View
                </button>

                <button
                  onClick={() => deleteLink(link.id)}
                  className="bg-red-600 text-white px-3 py-1 text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {analytics && (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Analytics for {analytics.shortCode}
          </h2>

          <p className="mb-2">
            Total Clicks: {analytics.clicks}
          </p>

          {chartData && (
            <div className="mb-6">
              <Line data={chartData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}