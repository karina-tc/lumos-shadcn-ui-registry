import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";
export default function LumosSettingsIndex() {
  const settingsCategories = [
    { label: "General" },
    { label: "Security", active: false },
    { label: "Provisioning", active: false },
    { label: "Notifications", active: false },
    { label: "Integrations", active: false },
    { label: "Billing", active: false },
    { label: "Team", active: false },
  ];

  return (
    <LumosLayout title="Settings" activeItem="Settings">
        <main className="flex-1 overflow-auto bg-background p-6">
          <PageHeader title="Settings" />

          <div className="flex gap-6 mt-4">

            {/* Settings vertical nav */}
            <nav className="w-52 flex-shrink-0 h-fit rounded-lg bg-secondary p-2">
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
                  <h2 className="text-h2 font-semibold text-foreground">Organization</h2>
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

            </div>
          </div>
        </main>
    </LumosLayout>
  );
}
