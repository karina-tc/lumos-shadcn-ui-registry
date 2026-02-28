import { PageHeader } from "@/components/page-header";

export default function IntegrationsPage() {
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
    <main className="flex-1 overflow-auto bg-background p-6">
      <div className="flex flex-col gap-6">
        <PageHeader title="Integrations" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">Add Integration</button></>} />

        <input placeholder="Search integrations..." className="h-9 w-72 rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring" />

        {integrationSections.map((section) => (
          <div key={section.heading} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-foreground">{section.heading}</h3>
            <div className="grid grid-cols-3 gap-4">
              {section.integrations.map((integration) => (
                <div key={integration.name} className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md bg-muted text-sm font-semibold text-muted-foreground">{integration.name[0]}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground leading-tight">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    {integration.connected ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Connected</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">Not Connected</span>
                    )}
                    {integration.connected ? (
                      <a href="#" className="text-xs font-medium text-primary hover:underline">Configure</a>
                    ) : (
                      <button className="inline-flex h-7 items-center rounded-full bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/85">Connect</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
