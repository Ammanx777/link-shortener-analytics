"use client";

import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import CreateLinkForm from "@/components/CreateLinkForm";
import LinksTable from "@/components/LinksTable";
import AnalyticsChart from "@/components/AnalyticsChart";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/StatsCards";

export default function Home() {
  const router = useRouter();
  const { status, data: session } = useSession();

  const [token, setToken] = useState<string | null>(null);

  const [links, setLinks] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  useEffect(() => {
    const initAuth = async () => {
      if (status === "loading") return;

      let jwt = localStorage.getItem("token");

      if (!jwt && status === "authenticated" && session?.user?.email) {
        try {
          const res = await fetch("http://localhost:5000/google-login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: session.user.email,
            }),
          });

          const data = await res.json();

          if (res.ok && data.token) {
            localStorage.setItem("token", data.token);
            jwt = data.token;
          } else {
            toast.error("Google login failed");
            router.replace("/login");
            return;
          }
        } catch {
          toast.error("Google login error");
          router.replace("/login");
          return;
        }
      }

      if (!jwt) {
        router.replace("/login");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/me", {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!res.ok) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        setToken(jwt);
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    initAuth();
  }, [status, session, router]);

  useEffect(() => {
    if (!token) return;
    fetchLinks();
  }, [token]);

  useEffect(() => {
    if (!selectedCode) return;

    const interval = setInterval(() => {
      fetchAnalytics(selectedCode);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedCode]);

  const fetchLinks = async () => {
    try {
      const jwt = localStorage.getItem("token");
      if (!jwt) return;

      const res = await fetch("http://localhost:5000/links", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setLinks(data);
      } else {
        setLinks([]);
      }
    } catch {
      toast.error("Failed to fetch links");
      setLinks([]);
    }
  };

  const createShortUrl = async () => {
    const jwt = localStorage.getItem("token");

    if (!jwt) {
      toast.error("Login required");
      return;
    }

    const res = await fetch("http://localhost:5000/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
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
      toast.error(data.error || "Failed to create link");
      return;
    }

    toast.success("Short link created!");

    setUrl("");
    setCustomCode("");
    setExpiresAt("");

    fetchLinks();
  };

  const fetchAnalytics = async (shortCode: string) => {
    const jwt = localStorage.getItem("token");
    if (!jwt) return;

    const res = await fetch(
      `http://localhost:5000/analytics/${shortCode}`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    const data = await res.json();

    setAnalytics(data);
    setSelectedCode(shortCode);
  };

  const deleteLink = async (id: number) => {
    const jwt = localStorage.getItem("token");
    if (!jwt) return;

    try {
      const res = await fetch(`http://localhost:5000/links/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Failed to delete link");
        return;
      }

      toast.success("Link deleted");

      setLinks((prev) => prev.filter((l) => l.id !== id));

      if (selectedCode) {
        setAnalytics(null);
        setSelectedCode(null);
      }

    } catch {
      toast.error("Server error while deleting");
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white/60">
        Loading dashboard...
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="glass-strong p-6 rounded-2xl mb-8">
        <h1 className="text-3xl font-semibold">
          Dashboard Overview
        </h1>
      </div>

      <StatsCards links={links} />

      <div className="glass-strong p-6 rounded-2xl mt-8">
        <CreateLinkForm
          url={url}
          setUrl={setUrl}
          customCode={customCode}
          setCustomCode={setCustomCode}
          expiresAt={expiresAt}
          setExpiresAt={setExpiresAt}
          onSubmit={createShortUrl}
        />
      </div>

      <div className="glass-strong p-6 rounded-2xl mt-8">
        <LinksTable
          links={links}
          onAnalytics={fetchAnalytics}
          onDelete={deleteLink}
        />
      </div>

      {analytics && (
        <div className="glass-strong p-6 rounded-2xl mt-8">
          <AnalyticsChart analytics={analytics} />
        </div>
      )}
    </DashboardLayout>
  );
}