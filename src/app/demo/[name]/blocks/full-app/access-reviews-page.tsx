import { PageHeader } from "@/components/page-header";
import { PageTabs } from "@/components/page-tabs";
import { Button } from "@/components/ui/button";

export default function AccessReviewsPage() {
  const reviews = [
    { name: "Q1 Salesforce Review", app: "Salesforce", reviewer: "Sarah Chen", dueDate: "Mar 31", reviewed: 12, total: 45, status: "In Progress" },
    { name: "GitHub Access Audit", app: "GitHub", reviewer: "Marcus Williams", dueDate: "Mar 15", reviewed: 45, total: 89, status: "In Progress" },
    { name: "Annual Figma Review", app: "Figma", reviewer: "Priya Patel", dueDate: "Feb 28", reviewed: 34, total: 34, status: "Complete" },
    { name: "AWS IAM Review", app: "AWS", reviewer: "Jordan Kim", dueDate: "Mar 20", reviewed: 0, total: 12, status: "Not Started" },
    { name: "Okta Admin Review", app: "Okta", reviewer: "Alex Rivera", dueDate: "Mar 25", reviewed: 8, total: 23, status: "In Progress" },
    { name: "Notion Workspace Review", app: "Notion", reviewer: "Taylor Nguyen", dueDate: "Apr 1", reviewed: 0, total: 67, status: "Not Started" },
  ];

  function getStatusBadge(status: string) {
    if (status === "Complete") return <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">{status}</span>;
    if (status === "In Progress") return <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">{status}</span>;
    return <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">{status}</span>;
  }

  return (
    <main className="flex-1 overflow-auto bg-background p-6">
      <div className="flex flex-col gap-4">
        <PageHeader title="Access Reviews" actions={<><Button variant="tertiary">Settings</Button><Button>New Review</Button></>} />
        <PageTabs tabs={["In Progress", "Scheduled", "Completed"]} activeTab="In Progress" />

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
                  <td className="px-4 py-3"><span className="font-medium text-foreground">{row.name}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-5 w-5 rounded bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">{row.app[0]}</div>
                      <span className="text-muted-foreground">{row.app}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.reviewer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.dueDate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${row.total > 0 ? Math.round((row.reviewed / row.total) * 100) : 0}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{row.reviewed}/{row.total} reviewed</span>
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
  );
}
