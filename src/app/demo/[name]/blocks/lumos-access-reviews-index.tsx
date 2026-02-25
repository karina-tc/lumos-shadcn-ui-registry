export default function LumosAccessReviewsIndex() {
  const navSections = [
    {
      label: "Products",
      items: [
        { label: "Ask Albus", href: "#" },
        { label: "Analytics", href: "#" },
        { label: "AppStore", href: "#" },
        { label: "Access Reviews", href: "#", active: true },
        { label: "Onboarding", href: "#" },
        { label: "Movers", href: "#" },
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
        { label: "Vendors", href: "#" },
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

  const reviews = [
    {
      name: "Q1 Salesforce Review",
      app: "Salesforce",
      reviewer: "Sarah Chen",
      dueDate: "Mar 31",
      reviewed: 12,
      total: 45,
      status: "In Progress",
    },
    {
      name: "GitHub Access Audit",
      app: "GitHub",
      reviewer: "Marcus Williams",
      dueDate: "Mar 15",
      reviewed: 45,
      total: 89,
      status: "In Progress",
    },
    {
      name: "Annual Figma Review",
      app: "Figma",
      reviewer: "Priya Patel",
      dueDate: "Feb 28",
      reviewed: 34,
      total: 34,
      status: "Complete",
    },
    {
      name: "AWS IAM Review",
      app: "AWS",
      reviewer: "Jordan Kim",
      dueDate: "Mar 20",
      reviewed: 0,
      total: 12,
      status: "Not Started",
    },
    {
      name: "Okta Admin Review",
      app: "Okta",
      reviewer: "Alex Rivera",
      dueDate: "Mar 25",
      reviewed: 8,
      total: 23,
      status: "In Progress",
    },
    {
      name: "Notion Workspace Review",
      app: "Notion",
      reviewer: "Taylor Nguyen",
      dueDate: "Apr 1",
      reviewed: 0,
      total: 67,
      status: "Not Started",
    },
  ];

  function getStatusBadge(status: string) {
    if (status === "Complete") {
      return (
        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
          {status}
        </span>
      );
    }
    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          {status}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        {status}
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
          <h1 className="text-sm font-medium text-foreground">Access Reviews</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              New Review
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex flex-col gap-4">
            {/* Page title + description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">Access Reviews</h2>
              <p className="text-sm text-muted-foreground">Manage and track access review campaigns</p>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search reviews..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                App
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Review Name</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">App</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reviewer</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Progress</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3">
                        <span className="font-medium text-foreground">{row.name}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {row.app[0]}
                          </div>
                          <span className="text-muted-foreground">{row.app}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.reviewer}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.dueDate}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{ width: `${row.total > 0 ? Math.round((row.reviewed / row.total) * 100) : 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {row.reviewed}/{row.total} reviewed
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(row.status)}</td>
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
