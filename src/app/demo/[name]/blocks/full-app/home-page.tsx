import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/lumos-button";

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Welcome to Lumos"
        description="Enterprise access management platform"
      />
      <div className="p-6 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Get Started</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Explore the features in the sidebar to manage access, view analytics,
            and more.
          </p>
        </Card>
      </div>
    </>
  );
}
