"use client";

import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

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

  /*
  GOOGLE LOGIN SYNC → GET JWT FROM BACKEND
  */
  useEffect(() => {

    const syncGoogleUser = async () => {

      if (status !== "authenticated") return;

      const existingToken = localStorage.getItem("token");
      if (existingToken) return;

      try {

        const res = await fetch("http://localhost:5000/google-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: session?.user?.email || ""
          })
        });

        const data = await res.json();

        if (data.token) {
          localStorage.setItem("token", data.token);
          window.location.reload();
        }

      } catch (err) {
        console.error("Google sync failed:", err);
        toast.error("Google login sync failed");
      }

    };

    syncGoogleUser();

  }, [status, session]);

  /*
  AUTH CHECK
  */
  useEffect(() => {

    if (status === "loading") return;

    const jwt = localStorage.getItem("token");

    if (jwt) {
      setToken(jwt);
      return;
    }

    if (status === "authenticated") {
      setToken("google");
      return;
    }

    router.replace("/login");

  }, [status, router]);

  /*
  FETCH LINKS
  */
  useEffect(() => {

    if (!token) return;
    if (token === "google") return;

    fetchLinks();

  }, [token]);

  /*
  AUTO REFRESH ANALYTICS
  */
  useEffect(() => {

    if (!selectedCode) return;

    const interval = setInterval(() => {
      fetchAnalytics(selectedCode);
    }, 5000);

    return () => clearInterval(interval);

  }, [selectedCode]);

  /*
  FETCH LINKS
  */
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

    } catch (err) {
      console.error("Fetch links error:", err);
      toast.error("Failed to fetch links");
      setLinks([]);
    }
  };

  /*
  CREATE SHORT URL
  */
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

  /*
  FETCH ANALYTICS
  */
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

  /*
  DELETE LINK
  */
  const deleteLink = async (id: number) => {

    const jwt = localStorage.getItem("token");
    if (!jwt) return;

    await fetch(`http://localhost:5000/links/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    toast.success("Link deleted");

    setAnalytics(null);
    setSelectedCode(null);

    fetchLinks();
  };

  /*
  LOADING STATE
  */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  return (
  <DashboardLayout>

    <h1 className="text-3xl font-bold mb-8">
  Dashboard Overview
</h1>

    {/* STATS */}
    <StatsCards links={links} />

    {/* FORM */}
    <CreateLinkForm
      url={url}
      setUrl={setUrl}
      customCode={customCode}
      setCustomCode={setCustomCode}
      expiresAt={expiresAt}
      setExpiresAt={setExpiresAt}
      onSubmit={createShortUrl}
    />

    {/* TABLE */}
    <LinksTable
      links={links}
      onAnalytics={fetchAnalytics}
      onDelete={deleteLink}
    />

    {/* ANALYTICS */}
    {analytics && (
      <AnalyticsChart analytics={analytics} />
    )}

  </DashboardLayout>
);
}