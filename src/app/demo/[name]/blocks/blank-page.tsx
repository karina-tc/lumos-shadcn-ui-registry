import { LumosLayout } from "@/components/lumos-layout";

export default function BlankPage() {
  return (
    <LumosLayout title="Home">
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Your content goes here.</p>
      </div>
    </LumosLayout>
  );
}
