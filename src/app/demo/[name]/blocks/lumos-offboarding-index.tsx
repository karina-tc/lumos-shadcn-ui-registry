export default function LumosOffboardingIndex() {
  const navSections = [
    {
      label: "Products",
      items: [
        { label: "Ask Albus", href: "#" },
        { label: "Analytics", href: "#" },
        { label: "AppStore", href: "#" },
        { label: "Access Reviews", href: "#" },
        { label: "Onboarding", href: "#" },
        { label: "Offboarding", href: "#", active: true },
      ],
    },
    {
      label: "Inventory",
      items: [
        { label: "Apps", href: "#" },
        { label: "Identities", href: "#" },
        { label: "Access Policies", href: "#" },
        { label: "Accounts", href: "#" },
        { label: "Managed Agreements", href: "#" },
        { label: "Spend Records", href: "#" },
        { label: "Knowledge Hub", href: "#" },
      ],
    },
    {
      label: "Workspace",
      items: [
        { label: "Activity Log", href: "#" },
        { label: "Integrations", href: "#" },
        { label: "Settings", href: "#" },
        { label: "Tasks", href: "#" },
      ],
    },
  ];

  const offboardings = [
    {
      employee: "Jordan Kim",
      lastDay: "Feb 28, 2026",
      manager: "Sarah Chen",
      appsRevoked: "12/12 apps",
      dataExported: "Yes",
      status: "Complete",
    },
    {
      employee: "Blake Morales",
      lastDay: "Mar 7, 2026",
      manager: "Marcus Williams",
      appsRevoked: "7/11 apps",
      dataExported: "No",
      status: "In Progress",
    },
    {
      employee: "Quinn Zhang",
      lastDay: "Mar 14, 2026",
      manager: "Priya Patel",
      appsRevoked: "0/9 apps",
      dataExported: "No",
      status: "Pending",
    },
    {
      employee: "Sage Okafor",
      lastDay: "Feb 14, 2026",
      manager: "Alex Rivera",
      appsRevoked: "15/15 apps",
      dataExported: "Yes",
      status: "Complete",
    },
    {
      employee: "Reese Hoffman",
      lastDay: "Mar 21, 2026",
      manager: "Jordan Kim",
      appsRevoked: "3/8 apps",
      dataExported: "No",
      status: "In Progress",
    },
    {
      employee: "Phoenix Carter",
      lastDay: "Mar 28, 2026",
      manager: "Taylor Nguyen",
      appsRevoked: "0/6 apps",
      dataExported: "No",
      status: "Pending",
    },
  ];

  function statusBadge(status: string) {
    if (status === "Complete") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          Complete
        </span>
      );
    }
    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
        Pending
      </span>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 flex-shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
          <div className="h-6 w-6 rounded-sm bg-primary" />
          <span className="text-sm font-semibold text-foreground">Lumos</span>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {section.label}
              </p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={`flex items-center rounded-md px-2 py-1.5 text-sm transition-colors ${
                        item.active
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-sidebar-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-12 items-center gap-4 border-b border-border bg-background px-6">
          <h1 className="text-sm font-medium text-foreground">Offboarding</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              New Offboarding
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Offboarding</h2>
              <p className="text-sm text-muted-foreground">
                Track employee offboarding, app revocation, and data export status
              </p>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search employees..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Status
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Manager
              </button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Employee</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Day</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Manager</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Apps Revoked</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Data Exported</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {offboardings.map((row) => (
                    <tr
                      key={row.employee}
                      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {row.employee.split(" ").map((n) => n[0]).join("")}
                          </div>
                          <span className="font-medium text-foreground">{row.employee}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.lastDay}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.manager}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.appsRevoked}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            row.dataExported === "Yes"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {row.dataExported}
                        </span>
                      </td>
                      <td className="px-4 py-3">{statusBadge(row.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
