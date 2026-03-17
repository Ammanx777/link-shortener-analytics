"use client";

export default function StatsCards({ links }: any) {

  const totalLinks = links.length;
  const totalClicks = links.reduce(
    (sum: number, l: any) => sum + l.clicks,
    0
  );

  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 rounded-xl shadow">
      <p className="text-sm opacity-80">Total Links</p>
      <h2 className="text-3xl font-bold">{totalLinks}</h2>
    </div>

    <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-5 rounded-xl shadow">
      <p className="text-sm opacity-80">Total Clicks</p>
      <h2 className="text-3xl font-bold">{totalClicks}</h2>
    </div>

    <div className="bg-gradient-to-r from-purple-600 to-purple-500 text-white p-5 rounded-xl shadow">
      <p className="text-sm opacity-80">Active Links</p>
      <h2 className="text-3xl font-bold">{totalLinks}</h2>
    </div>

  </div>

);}