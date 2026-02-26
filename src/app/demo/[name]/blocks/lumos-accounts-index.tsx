import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";
import { PageTabs } from "@/components/page-tabs";
export default function LumosAccountsIndex() {
  const accounts = [
    { username: "s.chen@acme", app: "Salesforce", identity: "Sarah Chen", accountType: "Admin", lastLogin: "Today" },
    { username: "m.williams", app: "GitHub", identity: "Marcus Williams", accountType: "Member", lastLogin: "Yesterday" },
    { username: "patel.p", app: "Figma", identity: "Priya Patel", accountType: "Editor", lastLogin: "3 days ago" },
    { username: "jkim", app: "Slack", identity: "Jordan Kim", accountType: "Member", lastLogin: "\u2014" },
    { username: "alex.r", app: "Notion", identity: "Alex Rivera", accountType: "Member", lastLogin: "Today" },
    { username: "t.nguyen", app: "Zoom", identity: "Taylor Nguyen", accountType: "Member", lastLogin: "5 days ago" },
  ];

  return (
    <LumosLayout title="Accounts" activeItem="Accounts">
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex flex-col gap-4">
            {/* Page title + description */}
            <PageHeader title="Accounts" description="All user accounts across connected applications" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-secondary">Export</button></>} />

            <PageTabs
              tabs={["All", "Inactive", "Terminated", "Unmatched"]}
              activeTab="All"
            />

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search accounts..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                App
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Account Type
              </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Account</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">App</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Identity</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Account Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((row) => (
                    <tr key={row.username} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{row.username}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {row.app[0]}
                          </div>
                          <span className="text-muted-foreground">{row.app}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.identity}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          {row.accountType}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.lastLogin}</td>
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
