"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsChart({
  analytics,
  range,
  chartType,
}: any) {

  if (!analytics?.clicksData) return null;

  const now = new Date();

  const filtered = analytics.clicksData.filter((click: any) => {
    const date = new Date(click.createdAt);

    if (range === "7d") {
      return now.getTime() - date.getTime() <= 7 * 86400000;
    }

    if (range === "30d") {
      return now.getTime() - date.getTime() <= 30 * 86400000;
    }

    return true;
  });

  const grouped: Record<string, number> = {};

  filtered.forEach((click: any) => {
    const date = new Date(click.createdAt).toLocaleDateString();
    grouped[date] = (grouped[date] || 0) + 1;
  });

  const chartData = {
    labels: Object.keys(grouped),
    datasets: [
      {
        label: "Clicks",
        data: Object.values(grouped),
        borderColor: "rgba(96,165,250,1)",
        backgroundColor: "rgba(96,165,250,0.4)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="glass-strong p-6 rounded-2xl">

      <h2 className="text-lg font-semibold mb-2">
        Analytics for {analytics.shortCode}
      </h2>

      <p className="text-white/60 mb-6 text-sm">
        Total Clicks: {analytics.clicks}
      </p>

      <div className="bg-white/5 rounded-xl p-4">
        {chartType === "line" ? (
          <Line data={chartData} />
        ) : (
          <Bar data={chartData} />
        )}
      </div>

    </div>
  );
}