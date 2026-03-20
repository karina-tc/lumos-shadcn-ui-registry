import { notFound } from "next/navigation";

import { demos } from "@/app/demo/[name]/index";

import { Renderer } from "@/app/demo/[name]/renderer";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";

export async function generateStaticParams() {
  const allItems = getRegistryItems();
  return allItems.map((item) => ({
    name: item.name,
  }));
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  const component = getRegistryItem(name);
  const demo = demos[name];

  if (!component) {
    notFound();
  }

  // If no explicit demo, show registry item metadata
  const components = demo?.components || { Default: null };

  return (
    <div className="flex h-[100vh] w-full flex-col gap-4 bg-card">
      {demo ? (
        Object.entries(components).map(([key, node]) => (
          <div className="relative w-full" key={key}>
            <Renderer>{node}</Renderer>
          </div>
        ))
      ) : (
        <div className="flex flex-col gap-4 p-6">
          <div>
            <h1 className="text-2xl font-bold">{component.title}</h1>
            <p className="text-sm text-muted-foreground mt-2">
              {component.description}
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            <p>Type: {component.type}</p>
            {component.files && (
              <p>Files: {component.files.length}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
