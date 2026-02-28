import { PageHeader } from "@/components/page-header";

export default function AccessPoliciesPage() {
  const policies = [
    { name: "Standard Engineering", type: "Onboarding", appsCovered: "14 apps", usersAssigned: "89 users", lastModified: "Feb 10, 2026", status: "Active" },
    { name: "Sales Onboarding", type: "Onboarding", appsCovered: "9 apps", usersAssigned: "45 users", lastModified: "Jan 28, 2026", status: "Active" },
    { name: "Design Standard", type: "Onboarding", appsCovered: "8 apps", usersAssigned: "34 users", lastModified: "Feb 3, 2026", status: "Active" },
    { name: "Engineering Lead", type: "Onboarding", appsCovered: "18 apps", usersAssigned: "12 users", lastModified: "Feb 15, 2026", status: "Active" },
    { name: "Marketing Standard", type: "Onboarding", appsCovered: "7 apps", usersAssigned: "23 users", lastModified: "Jan 20, 2026", status: "Active" },
    { name: "Contractor Access", type: "Onboarding", appsCovered: "4 apps", usersAssigned: "67 users", lastModified: "Feb 22, 2026", status: "Draft" },
  ];

  function typeBadge(type: string) {
    return <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{type}</span>;
  }

  function statusBadge(status: string) {
    if (status === "Active") return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Active</span>;
    return <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Draft</span>;
  }

  return (
    <main className="flex-1 overflow-auto bg-background p-6">
      <div className="flex flex-col gap-4">
        <PageHeader title="Access Policies" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">New Policy</button></>} />

        <div className="flex items-center gap-2">
          <input placeholder="Search policies..." className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />
          <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">Type</button>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">Status</button>
        </div>

        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Policy Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Apps Covered</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Users Assigned</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Modified</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((row) => (
                <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                  <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
                  <td className="px-4 py-3">{typeBadge(row.type)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.appsCovered}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.usersAssigned}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.lastModified}</td>
                  <td className="px-4 py-3">{statusBadge(row.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
