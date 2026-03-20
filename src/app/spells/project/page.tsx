import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';

export default function SpellTemplate() {
  return (
    <LumosLayout>
      <div className="p-6">
        <PageHeader
          title="Spell Template"
          description="Blank canvas — build your prototype here"
        />
      </div>
    </LumosLayout>
  );
}
