export default function LumosOnboardingIndex() {
  const navSections = [
    {
      label: "Products",
      items: [
        { label: "Ask Albus", href: "#" },
        { label: "Analytics", href: "#" },
        { label: "AppStore", href: "#" },
        { label: "Access Reviews", href: "#" },
        { label: "Onboarding", href: "#", active: true },
        { label: "Offboarding", href: "#" },
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

  const onboardings = [
    {
      employee: "Jamie Torres",
      startDate: "Mar 3, 2026",
      manager: "Sarah Chen",
      appsProvisioned: "8/12 apps",
      accessPolicy: "Standard Eng",
      status: "In Progress",
    },
    {
      employee: "Morgan Lee",
      startDate: "Mar 10, 2026",
      manager: "Marcus Williams",
      appsProvisioned: "0/9 apps",
      accessPolicy: "Sales Onboard",
      status: "Pending",
    },
    {
      employee: "Casey Pham",
      startDate: "Feb 24, 2026",
      manager: "Priya Patel",
      appsProvisioned: "12/12 apps",
      accessPolicy: "Design Standard",
      status: "Complete",
    },
    {
      employee: "Drew Wilson",
      startDate: "Mar 17, 2026",
      manager: "Jordan Kim",
      appsProvisioned: "0/14 apps",
      accessPolicy: "Engineering Lead",
      status: "Pending",
    },
    {
      employee: "Riley Brooks",
      startDate: "Feb 17, 2026",
      manager: "Alex Rivera",
      appsProvisioned: "9/9 apps",
      accessPolicy: "Marketing",
      status: "Complete",
    },
    {
      employee: "Avery Santos",
      startDate: "Mar 24, 2026",
      manager: "Taylor Nguyen",
      appsProvisioned: "0/7 apps",
      accessPolicy: "HR Standard",
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
          <h1 className="text-sm font-medium text-foreground">Onboarding</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              New Onboarding
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Onboarding</h2>
              <p className="text-sm text-muted-foreground">
                Track new employee onboarding and app provisioning progress
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Start Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Manager</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Apps Provisioned</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Access Policy</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {onboardings.map((row) => (
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
                      <td className="px-4 py-3 text-muted-foreground">{row.startDate}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.manager}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.appsProvisioned}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.accessPolicy}</td>
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
