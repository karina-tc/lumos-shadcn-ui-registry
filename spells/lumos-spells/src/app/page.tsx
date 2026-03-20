import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { LumosButton } from '@/components/lumos-button';
import { Card } from '@/components/ui/card';

export default function Home() {
  return (
    <LumosLayout>
      <PageHeader
        title="Lumos Spells"
        description="Prototype app built with Lumos components"
      />
      <div className="p-6 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Welcome</h2>
          <p className="text-sm text-muted-foreground mt-2">
            This is a Lumos spell — a prototype built with components from the registry.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Getting Started</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Add pages to src/app/ and import Lumos components to build your prototype.
          </p>
        </Card>
      </div>
    </LumosLayout>
  );
}
