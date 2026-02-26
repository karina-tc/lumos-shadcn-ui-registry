import { LumosLayout } from "@/components/lumos-layout";
import { PageHeader } from "@/components/page-header";
export default function LumosTasksIndex() {
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
    <LumosLayout title="Tasks" activeItem="Tasks">
        <main className="flex-1 overflow-auto bg-background p-6">
          <div className="flex flex-col gap-4">
            <PageHeader title="Tasks" description="Pending admin actions and follow-ups across your workspace" actions={<><button className="inline-flex h-8 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/85">New Task</button></>} />

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
    </LumosLayout>
  );
}
