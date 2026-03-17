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
        borderColor: "rgb(59,130,246)",
        backgroundColor: "rgba(59,130,246,0.5)",
      },
    ],
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Analytics for {analytics.shortCode}
      </h2>

      <p className="text-gray-500 mb-4">
        Total Clicks: {analytics.clicks}
      </p>

      {chartType === "line" ? (
        <Line data={chartData} />
      ) : (
        <Bar data={chartData} />
      )}

    </div>
  );
}