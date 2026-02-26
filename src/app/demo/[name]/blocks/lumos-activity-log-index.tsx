import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";
export default function LumosActivityLogIndex() {
  const events = [
    {
      action: "App access granted",
      actor: "sarah.chen@acme.com",
      resource: "Salesforce / s.chen@acme",
      time: "2 min ago",
      ipAddress: "192.168.1.42",
    },
    {
      action: "User offboarded",
      actor: "admin@acme.com",
      resource: "Jordan Kim",
      time: "1 hour ago",
      ipAddress: "10.0.0.1",
    },
    {
      action: "Policy updated",
      actor: "marcus.williams@acme.com",
      resource: "Standard Eng Policy",
      time: "3 hours ago",
      ipAddress: "192.168.1.85",
    },
    {
      action: "Access review started",
      actor: "system",
      resource: "Q1 Salesforce Review",
      time: "5 hours ago",
      ipAddress: "—",
    },
    {
      action: "App access revoked",
      actor: "admin@acme.com",
      resource: "GitHub / jkim",
      time: "Yesterday",
      ipAddress: "10.0.0.1",
    },
    {
      action: "User invited",
      actor: "taylor.nguyen@acme.com",
      resource: "casey.pham@acme.com",
      time: "Yesterday",
      ipAddress: "192.168.1.22",
    },
    {
      action: "Integration synced",
      actor: "system",
      resource: "Okta",
      time: "2 days ago",
      ipAddress: "—",
    },
    {
      action: "Account matched",
      actor: "system",
      resource: "alex.r → Alex Rivera",
      time: "2 days ago",
      ipAddress: "—",
    },
  ];

  return (
    <LumosLayout title="Activity Log" activeItem="Activity Log">
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex flex-col gap-4">
            <PageHeader title="Activity Log" description="Audit trail of all admin actions across your workspace" />

            {/* Search + filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search actions..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Actor
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Action Type
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Date Range
              </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actor</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Resource</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Time</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.action}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.actor}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.resource}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.time}</td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
    </LumosLayout>
  );
}
