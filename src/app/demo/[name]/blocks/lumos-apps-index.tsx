export default function LumosAppsIndex() {
  const navSections = [
    {
      label: "Products",
      items: [
        { label: "Ask Albus", href: "#" },
        { label: "Analytics", href: "#" },
        { label: "AppStore", href: "#" },
        { label: "Access Reviews", href: "#" },
        { label: "Onboarding", href: "#" },
        { label: "Movers", href: "#" },
        { label: "Offboarding", href: "#" },
      ],
    },
    {
      label: "Inventory",
      items: [
        { label: "Apps", href: "#", active: true },
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

  const apps = [
    { name: "Salesforce", category: "CRM", users: 142, cost: "$4,200/mo", status: "Active" },
    { name: "GitHub", category: "Engineering", users: 89, cost: "$1,800/mo", status: "Active" },
    { name: "Figma", category: "Design", users: 34, cost: "$680/mo", status: "Active" },
    { name: "Slack", category: "Productivity", users: 200, cost: "$3,400/mo", status: "Active" },
    { name: "Notion", category: "Productivity", users: 67, cost: "$540/mo", status: "Active" },
    { name: "Zoom", category: "Communication", users: 150, cost: "$2,100/mo", status: "Active" },
  ];

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
          <h1 className="text-sm font-medium text-foreground">Apps</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              Add App
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex flex-col gap-4">
            {/* Page title + description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">Apps</h2>
              <p className="text-sm text-muted-foreground">Manage all applications in your workspace</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-border">
              {["Apps", "Spend", "Ignored"].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    tab === "Apps"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search apps..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Category
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">App</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Users</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Monthly Cost</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((row) => (
                    <tr key={row.name} className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                            {row.name[0]}
                          </div>
                          <span className="font-medium text-foreground">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{row.category}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.users}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.cost}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          {row.status}
                        </span>
                      </td>
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
