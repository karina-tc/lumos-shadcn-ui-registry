import { PageHeader } from "@/components/page-header";

export default function AppsPage() {
  const apps = [
    { name: "Google Workspace", initial: "G", status: "Approved", admin: "AD", accounts: 9, category: "Collaboration", sources: ["L", "G"], smahtAI: "Keys at the t..." },
    { name: "Google Cloud", initial: "G", status: "Approved", admin: null, accounts: 6, category: "IT & Security", sources: ["L"], smahtAI: "Silent creden..." },
    { name: "Okta", initial: "O", status: "Approved", admin: null, accounts: 194, category: "IT & Security", sources: ["L"], smahtAI: "Password sn..." },
    { name: "Slack", initial: "S", status: "Approved", admin: null, accounts: 12, category: "Communication", sources: ["L"], smahtAI: "Roles weave..." },
    { name: "Lumos", initial: "L", status: "Discovered", admin: null, accounts: 0, category: "Other", sources: ["M", "G"], smahtAI: "Token in my..." },
    { name: "Atlassian", initial: "A", status: "Discovered", admin: null, accounts: 0, category: "Collaboration", sources: ["G"], smahtAI: "MFA sunrise..." },
    { name: "Box", initial: "B", status: "Discovered", admin: null, accounts: 0, category: "Collaboration", sources: ["M", "G"], smahtAI: "Provision an..." },
    { name: "Adobe", initial: "A", status: "Discovered", admin: null, accounts: 0, category: "Design & Creativity", sources: ["M", "G"], smahtAI: "Claims stitch..." },
    { name: "Pitch", initial: "P", status: "Approved", admin: null, accounts: 3, category: "Other", sources: ["O"], smahtAI: "Secrets in th..." },
    { name: "Notion", initial: "N", status: "Needs review", admin: null, accounts: 1, category: "Productivity", sources: ["O"], smahtAI: "One login rip..." },
  ];

  const statusStyle: Record<string, string> = {
    Approved: "bg-green-100 text-green-700",
    Discovered: "bg-neutral-100 text-neutral-600 border border-neutral-200",
    Blocklisted: "bg-red-100 text-red-700",
    Deprecated: "bg-yellow-100 text-yellow-700",
    "In review": "bg-blue-100 text-blue-700",
    "Needs review": "bg-orange-100 text-orange-700",
  };

  return (
    <>
      <PageHeader title="Applications" actions={<><div className="relative"><svg className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input placeholder="Search for an application" className="h-8 w-56 rounded-md border border-input bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" /></div><button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/85">+ Add App</button></>} />

      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Tabs */}
        <div className="flex items-center gap-1 border-b border-border bg-background px-6 pt-1">
          <button className="inline-flex items-center gap-1.5 rounded-t border-b-2 border-primary px-3 py-2 text-sm font-medium text-primary">
            All Apps <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">179</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            Ignored Apps <span className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">0</span>
          </button>
          <button className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted text-base leading-none">+</button>
        </div>

        {/* Content area: filter panel + table */}
        <div className="flex flex-1 overflow-hidden">
          {/* Table area */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Toolbar */}
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-border bg-background px-4">
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 4h13M3 8h9m-9 4h6m4 0 4-4 4 4m-4-4v12"/></svg>
                  Hide Filters
                </button>
                <span className="text-xs text-muted-foreground">179 Apps</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  Columns
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  Reset
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
                  Save
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background">
                  <tr className="border-b border-border">
                    <th className="w-8 px-3 py-2.5"><input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-primary" /></th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">App Name</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">App Status</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">App Admin</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Managed Accounts</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Category</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Sources</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">SmahtAI</th>
                    <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-3 py-2.5"><input type="checkbox" className="h-3.5 w-3.5 rounded border-border accent-primary" /></td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shrink-0">
                            {row.initial}
                          </div>
                          <span className="text-sm text-foreground">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${statusStyle[row.status]}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {row.admin ? (
                          <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-700">
                            {row.admin}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">–</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-sm text-muted-foreground">{row.accounts}</td>
                      <td className="px-3 py-2.5 text-sm text-muted-foreground">{row.category}</td>
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-1">
                          {row.sources.map((s, i) => (
                            <div key={i} className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                              {s}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 max-w-32">
                        <span className="text-xs text-muted-foreground truncate block">{row.smahtAI}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <button className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted">
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
