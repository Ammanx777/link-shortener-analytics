"use client";

export default function StatsCards({ links }: any) {

  const totalLinks = links.length;
  const totalClicks = links.reduce(
    (sum: number, l: any) => sum + l.clicks,
    0
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <div className="glass-strong p-6 rounded-2xl">
        <p className="text-secondary text-sm">Total Links</p>
        <h2 className="text-3xl font-semibold text-primary mt-2">
          {totalLinks}
        </h2>
      </div>

      <div className="glass-strong p-6 rounded-2xl">
        <p className="text-secondary text-sm">Total Clicks</p>
        <h2 className="text-3xl font-semibold text-primary mt-2">
          {totalClicks}
        </h2>
      </div>

      <div className="glass-strong p-6 rounded-2xl">
        <p className="text-secondary text-sm">Active Links</p>
        <h2 className="text-3xl font-semibold text-primary mt-2">
          {totalLinks}
        </h2>
      </div>

    </div>
  );
}