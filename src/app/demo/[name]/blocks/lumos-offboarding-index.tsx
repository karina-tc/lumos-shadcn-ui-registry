import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";
export default function LumosOffboardingIndex() {
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
    <LumosLayout title="Offboarding" activeItem="Employee Lifecycle">
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex flex-col gap-4">
            <PageHeader title="Offboarding" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">New Offboarding</button></>} />

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
    </LumosLayout>
  );
}
