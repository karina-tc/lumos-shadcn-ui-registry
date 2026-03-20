import { LumosLayout } from '@/components/lumos-layout';
import { PageHeader } from '@/components/page-header';

export default function SpellTemplate({ params }: { params: { project: string } }) {
  const projectName = params.project
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <LumosLayout>
      <PageHeader
        title={projectName}
        description="Blank canvas — build your spell here"
      />
      <div className="p-6">
        {/* Start building */}
      </div>
    </LumosLayout>
  );
}
