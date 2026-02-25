export default function LumosSettingsIndex() {
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
        { label: "Integrations", href: "#" },
        { label: "Settings", href: "#", active: true },
        { label: "Tasks", href: "#" },
      ],
    },
  ];

  const settingsCategories = [
    { label: "General", active: true },
    { label: "Security", active: false },
    { label: "Provisioning", active: false },
    { label: "Notifications", active: false },
    { label: "Integrations", active: false },
    { label: "Billing", active: false },
    { label: "Team", active: false },
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
          <h1 className="text-sm font-medium text-foreground">Settings</h1>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex gap-6">

            {/* Settings vertical nav */}
            <nav className="w-40 flex-shrink-0">
              <ul className="space-y-0.5">
                {settingsCategories.map((cat) => (
                  <li key={cat.label}>
                    <a
                      href="#"
                      className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors ${
                        cat.active
                          ? "bg-accent text-accent-foreground font-medium"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {cat.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Settings content */}
            <div className="flex flex-1 flex-col gap-5 min-w-0">

              {/* Organization section */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-foreground">Organization</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Manage your organization's basic information and branding.
                  </p>
                </div>

                <div className="flex flex-col gap-4 max-w-md">
                  {/* Organization Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Organization Name
                    </label>
                    <input
                      defaultValue="Acme Corp"
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {/* Domain */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Domain</label>
                    <input
                      defaultValue="acme.com"
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>

                  {/* Logo */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Logo</label>
                    <div className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/40">
                      <span className="text-xs text-muted-foreground">
                        Click to upload or drag and drop
                      </span>
                    </div>
                  </div>

                  <div>
                    <button className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
                      Save
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences section */}
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="mb-5">
                  <h2 className="text-base font-semibold text-foreground">Preferences</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Configure your workspace defaults for timezone, date formatting, and language.
                  </p>
                </div>

                <div className="flex flex-col gap-4 max-w-md">
                  {/* Default Timezone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">
                      Default Timezone
                    </label>
                    <select
                      defaultValue="America/Los_Angeles"
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="America/Los_Angeles">America/Los_Angeles</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Date Format</label>
                    <select
                      defaultValue="MM/DD/YYYY"
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Language */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-foreground">Language</label>
                    <select
                      defaultValue="English"
                      className="h-9 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                    </select>
                  </div>

                  <div>
                    <button className="inline-flex h-8 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
                      Save
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
