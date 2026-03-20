import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';
import { Card } from '@/components/ui/card';

export default function AppsPage() {
  return (
    <LumosLayout>
      <PageHeader
        title="Apps"
        description="Manage connected applications"
      />
      <div className="p-6 space-y-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold">Coming Soon</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Build out this page with your specific requirements.
          </p>
        </Card>
      </div>
    </LumosLayout>
  );
}
