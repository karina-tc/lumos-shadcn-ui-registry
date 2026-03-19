import { FullAppShell } from "@/components/full-app-layout";

export default function FullAppDemo() {
  return (
    <FullAppShell>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Full App Layout Demo</h1>
        <p className="text-muted-foreground">
          Click the toggle button (circle with arrow) in the top-left to collapse/expand the sidebar.
        </p>
        <div className="rounded-lg border border-border bg-card p-4">
          <p>This is sample content. The sidebar toggle should work here.</p>
        </div>
      </div>
    </FullAppShell>
  );
}
