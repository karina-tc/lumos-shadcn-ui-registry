export default function LumosTasksIndex() {
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
        { label: "Settings", href: "#" },
        { label: "Tasks", href: "#", active: true },
      ],
    },
  ];

  const tasks = [
    {
      task: "Review Q1 Salesforce access",
      type: "Access Review",
      assignedTo: "Sarah Chen",
      dueDate: "Mar 31",
      priority: "High",
      status: "Open",
    },
    {
      task: "Complete Jamie Torres onboarding",
      type: "Onboarding",
      assignedTo: "Marcus Williams",
      dueDate: "Mar 3",
      priority: "Medium",
      status: "In Progress",
    },
    {
      task: "Revoke Blake Morales app access",
      type: "Offboarding",
      assignedTo: "Admin",
      dueDate: "Mar 7",
      priority: "High",
      status: "In Progress",
    },
    {
      task: "Update Standard Eng policy",
      type: "Policy",
      assignedTo: "Priya Patel",
      dueDate: "Mar 15",
      priority: "Low",
      status: "Open",
    },
    {
      task: "Approve Zoom license expansion",
      type: "App Request",
      assignedTo: "Admin",
      dueDate: "Mar 20",
      priority: "Medium",
      status: "Open",
    },
    {
      task: "Export Q4 spend report",
      type: "Reporting",
      assignedTo: "Taylor Nguyen",
      dueDate: "Mar 25",
      priority: "Low",
      status: "Open",
    },
  ];

  function typeBadge(type: string) {
    const colorMap: Record<string, string> = {
      "Access Review": "bg-blue-100 text-blue-700",
      "Onboarding": "bg-green-100 text-green-700",
      "Offboarding": "bg-red-100 text-red-700",
      "Policy": "bg-yellow-100 text-yellow-700",
      "App Request": "bg-blue-100 text-blue-700",
      "Reporting": "bg-yellow-100 text-yellow-700",
    };
    const cls = colorMap[type] ?? "bg-muted text-muted-foreground";
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}>
        {type}
      </span>
    );
  }

  function priorityBadge(priority: string) {
    if (priority === "High") {
      return (
        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
          High
        </span>
      );
    }
    if (priority === "Medium") {
      return (
        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
          Medium
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Low
      </span>
    );
  }

  function statusBadge(status: string) {
    if (status === "In Progress") {
      return (
        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
          In Progress
        </span>
      );
    }
    return (
      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        Open
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
          <h1 className="text-sm font-medium text-foreground">Tasks</h1>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">
              New Task
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-secondary p-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Tasks</h2>
              <p className="text-sm text-muted-foreground">
                Pending admin actions and follow-ups across your workspace
              </p>
            </div>

            {/* Filter bar */}
            <div className="flex items-center gap-2">
              <input
                placeholder="Search tasks..."
                className="h-8 w-64 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Type
              </button>
              <button className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground hover:bg-secondary">
                Priority
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Task</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Assigned To</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((row) => (
                    <tr
                      key={row.task}
                      className="border-b border-border last:border-0 hover:bg-muted/30 cursor-pointer"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.task}</td>
                      <td className="px-4 py-3">{typeBadge(row.type)}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.assignedTo}</td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{row.dueDate}</td>
                      <td className="px-4 py-3">{priorityBadge(row.priority)}</td>
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
