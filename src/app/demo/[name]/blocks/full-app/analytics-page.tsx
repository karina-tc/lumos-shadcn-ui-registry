import { PageHeader } from "@/components/page-header";
import { PageTabs } from "@/components/page-tabs";

export default function AnalyticsPage() {
  const statCards = [
    { label: "Total Spend", value: "$47,200/mo", change: "↑ 8% vs last month", positive: true },
    { label: "Active Apps", value: "34", change: "↑ 2 new", positive: true },
    { label: "Active Users", value: "312", change: "→ no change", positive: null },
    { label: "Unused Licenses", value: "47", change: "↓ 12 resolved", positive: false },
  ];

  const topApps = [
    { name: "Salesforce", amount: 4200, max: 4200 },
    { name: "Slack", amount: 3400, max: 4200 },
    { name: "Zoom", amount: 2100, max: 4200 },
    { name: "GitHub", amount: 1800, max: 4200 },
    { name: "Figma", amount: 680, max: 4200 },
  ];

  const accessReviews = [
    { app: "Salesforce", reviewer: "Sarah Chen", status: "Completed", date: "Jun 12" },
    { app: "GitHub", reviewer: "Marcus Williams", status: "In Progress", date: "Jun 14" },
    { app: "Figma", reviewer: "Priya Patel", status: "Pending", date: "Jun 15" },
  ];

  const chartData = [
    { month: "Jan", value: 38000 },
    { month: "Feb", value: 41000 },
    { month: "Mar", value: 39000 },
    { month: "Apr", value: 44000 },
    { month: "May", value: 43000 },
    { month: "Jun", value: 47200 },
  ];
  const chartMax = 50000;
  const chartHeight = 120;

  return (
    <main className="flex-1 overflow-auto bg-background p-6">
      <div className="flex flex-col gap-5">
        <PageHeader title="Analytics" />

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div key={card.label} className="rounded-lg border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{card.label}</p>
              <p className="mt-1 text-xl font-semibold text-foreground">{card.value}</p>
              <p
                className={`mt-1 text-xs ${
                  card.positive === true
                    ? "text-green-600"
                    : card.positive === false
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {card.change}
              </p>
            </div>
          ))}
        </div>

        <PageTabs
          tabs={["Overview", "Spend", "AppStore", "Access Reviews"]}
          activeTab="Overview"
        />

        {/* 2-column layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left: Monthly Spend bar chart */}
          <div className="col-span-2 rounded-lg border border-border bg-card p-5">
            <p className="mb-4 text-sm font-semibold text-foreground">Monthly Spend</p>
            <svg
              width="100%"
              viewBox="0 0 360 150"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              {chartData.map((d, i) => {
                const barWidth = 36;
                const gap = 24;
                const x = i * (barWidth + gap) + 12;
                const barH = Math.round((d.value / chartMax) * chartHeight);
                const y = chartHeight - barH + 8;
                return (
                  <g key={d.month}>
                    <rect x={x} y={y} width={barWidth} height={barH} rx={3} className="fill-primary" />
                    <text x={x + barWidth / 2} y={chartHeight + 22} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: "10px" }}>
                      {d.month}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Right: Top Apps by Spend */}
          <div className="col-span-1 rounded-lg border border-border bg-card p-5">
            <p className="mb-4 text-sm font-semibold text-foreground">Top Apps by Spend</p>
            <ul className="space-y-3">
              {topApps.map((app) => (
                <li key={app.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{app.name}</span>
                    <span className="text-xs text-muted-foreground">${app.amount.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${Math.round((app.amount / app.max) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Access Reviews table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Recent Access Reviews</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">App</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Reviewer</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {accessReviews.map((row) => (
                <tr key={row.app} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-2.5 font-medium text-foreground">{row.app}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.reviewer}</td>
                  <td className="px-4 py-2.5">
                    {row.status === "Completed" ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{row.status}</span>
                    ) : row.status === "In Progress" ? (
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{row.status}</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{row.status}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
