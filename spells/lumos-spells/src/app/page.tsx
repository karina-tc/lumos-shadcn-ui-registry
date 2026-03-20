import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';

export default function Home() {
  return (
    <LumosLayout>
      <PageHeader
        title="Spell"
        description="Your prototype starts here"
      />
      <div className="p-6">
        {/* Blank canvas - build your spell here */}
      </div>
    </LumosLayout>
  );
}
