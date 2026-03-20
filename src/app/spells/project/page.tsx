import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';

export default function SpellTemplate() {
  return (
    <LumosLayout title="Blank Spell">
      <div className="p-6">
        <PageHeader
          title="Your Magic Awaits..."
          description="Build your spell here"
        />
      </div>
    </LumosLayout>
  );
}
