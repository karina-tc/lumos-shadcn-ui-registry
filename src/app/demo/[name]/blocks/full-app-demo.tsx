import { FullAppShell } from "@/components/full-app-layout";

export default function FullAppDemo() {
  return (
    <FullAppShell>
      <div className="space-y-4 p-5 size-full">
        <h1 className="text-2xl font-bold">Full App Layout Demo</h1>
        <div>
          <p>This is sample content</p>
        </div>
      </div>
    </FullAppShell>
  );
}
