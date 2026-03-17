"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AnalyticsChart from "@/components/AnalyticsChart";

export default function AnalyticsPage() {

  const [links, setLinks] = useState<any[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const [range, setRange] = useState("7d");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

  /*
  FETCH LINKS
  */
  useEffect(() => {
    const fetchLinks = async () => {
      const jwt = localStorage.getItem("token");
      if (!jwt) return;

      const res = await fetch("http://localhost:5000/links", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      const data = await res.json();
      if (Array.isArray(data)) setLinks(data);
    };

    fetchLinks();
  }, []);

  /*
  FETCH ANALYTICS
  */
  useEffect(() => {
    if (!selectedCode) return;

    const fetchAnalytics = async () => {
      const jwt = localStorage.getItem("token");
      if (!jwt) return;

      const res = await fetch(
        `http://localhost:5000/analytics/${selectedCode}`,
        {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const data = await res.json();
      setAnalytics(data);
    };

    fetchAnalytics();
  }, [selectedCode]);

  return (
    <DashboardLayout>

      <h1 className="text-3xl font-bold mb-6">
        Analytics
      </h1>

      {/* SELECT LINK */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-6 border border-gray-200 dark:border-gray-800">

  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
    Select Link
  </label>

  <div className="relative mt-3">

    <select
      className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 
      bg-gray-50 dark:bg-gray-800 
      text-gray-800 dark:text-white 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
      transition"
      onChange={(e) => setSelectedCode(e.target.value)}
    >
      <option value="">Choose a link</option>

      {links.map((link) => (
        <option key={link.id} value={link.shortCode}>
          {link.shortCode}
        </option>
      ))}
    </select>

    {/* Custom dropdown arrow */}
    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
      ▼
    </div>

  </div>

</div>

{analytics && (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow mb-6 border border-gray-200 dark:border-gray-800">

    <div className="flex flex-col md:flex-row gap-4">

      {/* RANGE */}
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Time Range
        </label>

        <div className="relative mt-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-800 
            text-gray-800 dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="all">All time</option>
          </select>

          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            ▼
          </div>
        </div>
      </div>

      {/* CHART TYPE */}
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
          Chart Type
        </label>

        <div className="relative mt-2">
          <select
            value={chartType}
            onChange={(e) =>
              setChartType(e.target.value as "line" | "bar")
            }
            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-gray-300 dark:border-gray-700 
            bg-gray-50 dark:bg-gray-800 
            text-gray-800 dark:text-white 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            transition"
          >
            <option value="line">Line Chart</option>
            <option value="bar">Bar Chart</option>
          </select>

          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
            ▼
          </div>
        </div>
      </div>

    </div>

  </div>
)}


      {/* CHART */}
      {analytics && (
        <AnalyticsChart
          analytics={analytics}
          range={range}
          chartType={chartType}
        />
      )}

    </DashboardLayout>
  );
}