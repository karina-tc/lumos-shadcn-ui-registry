import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";
export default function LumosIdentitiesIndex() {
  const identities = [
    { name: "Sarah Chen", email: "sarah@acme.com", department: "Engineering", status: "Active", lastActive: "Today" },
    { name: "Marcus Williams", email: "marcus@acme.com", department: "Sales", status: "Active", lastActive: "Yesterday" },
    { name: "Priya Patel", email: "priya@acme.com", department: "Design", status: "Active", lastActive: "2 days ago" },
    { name: "Jordan Kim", email: "jordan@acme.com", department: "Engineering", status: "Offboarded", lastActive: "Feb 10" },
    { name: "Alex Rivera", email: "alex@acme.com", department: "Marketing", status: "Active", lastActive: "Today" },
    { name: "Taylor Nguyen", email: "taylor@acme.com", department: "HR", status: "Active", lastActive: "3 days ago" },
  ];

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  }

  return (
    <LumosLayout title="Identities" activeItem="Identities">
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex flex-col gap-4">
            {/* Page title + description */}
            <PageHeader title="Identities" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-secondary">Sync</button><button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">Invite</button></>} />

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search identities..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Department
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Status
              </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Department</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Active</th>
                  </tr>
                </thead>
                <tbody>
                  {identities.map((row) => (
                    <tr key={row.email} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {getInitials(row.name)}
                          </div>
                          <span className="font-medium text-foreground">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.department}</td>
                      <td className="px-4 py-3">
                        {row.status === "Active" ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            {row.status}
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {row.status}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.lastActive}</td>
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
