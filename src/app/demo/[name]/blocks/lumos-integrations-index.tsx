export default function LumosIntegrationsIndex() {
  const navSections = [
    {
      label: "Products",
      items: [
        { label: "Ask Albus", href: "#" },
        { label: "Analytics", href: "#" },
        { label: "AppStore", href: "#" },
        { label: "Access Reviews", href: "#" },
        { label: "Onboarding", href: "#" },
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
        { label: "Integrations", href: "#", active: true },
        { label: "Settings", href: "#" },
        { label: "Tasks", href: "#" },
      ],
    },
  ];

  const integrationSections = [
    {
      heading: "Identity Providers",
      integrations: [
        { name: "Okta", category: "Identity Provider", connected: true },
        { name: "Azure AD", category: "Identity Provider", connected: true },
      ],
    },
    {
      heading: "HR Systems",
      integrations: [
        { name: "Workday", category: "HR System", connected: true },
        { name: "BambooHR", category: "HR System", connected: false },
      ],
    },
    {
      heading: "Productivity",
      integrations: [
        { name: "Google Workspace", category: "Productivity", connected: true },
        { name: "Slack", category: "Productivity", connected: true },
        { name: "Microsoft 365", category: "Productivity", connected: true },
        { name: "Zoom", category: "Productivity", connected: false },
      ],
    },
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
        <header className="flex h-12 items-center border-b border-border bg-background px-6">
          <h1 className="text-sm font-medium text-foreground">Integrations</h1>
          <div className="ml-auto">
            <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              Add Integration
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex flex-col gap-6">

            {/* Page heading + description + search */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Integrations</h2>
                <p className="text-sm text-muted-foreground">
                  Connect your tools to automate provisioning and sync data
                </p>
              </div>
            </div>

            {/* Search */}
            <input
              placeholder="Search integrations..."
              className="h-9 w-72 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />

            {/* Integration sections */}
            {integrationSections.map((section) => (
              <div key={section.heading} className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-foreground">{section.heading}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {section.integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      {/* Icon + name row */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground">
                          {integration.name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-foreground leading-tight">
                            {integration.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{integration.category}</p>
                        </div>
                      </div>

                      {/* Status + action row */}
                      <div className="flex items-center justify-between">
                        {integration.connected ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Not Connected
                          </span>
                        )}
                        {integration.connected ? (
                          <a
                            href="#"
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Configure
                          </a>
                        ) : (
                          <button className="inline-flex h-7 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/85">
                            Connect
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

          </div>
        </main>
      </div>
    </div>
  );
}
