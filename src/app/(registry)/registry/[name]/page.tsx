import { ArrowLeft, Component as ComponentIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ComponentCard } from "@/components/registry/component-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Component as RegistryComponent } from "@/lib/registry";
import { getRegistryItem, getRegistryItems } from "@/lib/registry";
import { getPrompt } from "@/lib/utils";

export async function generateStaticParams() {
  const components = getRegistryItems();

  return components.map(({ name }) => ({
    name,
  }));
}

export default async function RegistryItemPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const component = getRegistryItem(name);

  if (!component) {
    notFound();
  }

  const related: RegistryComponent[] = (
    component.relatedComponents?.map((id) => {
      try {
        return getRegistryItem(id);
      } catch {
        return null;
      }
    }).filter((x): x is RegistryComponent => x != null) ?? []
  );

  return (
    <div className="container p-5 md:p-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="mr-2 size-4" />
              Back to Home
            </Link>
          </Button>
          <h1 className="font-bold text-3xl tracking-tight">
            {component.title}
          </h1>
        </div>
      </div>

      <ComponentCard
        component={component}
        baseUrl={process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ""}
        prompt={getPrompt()}
      />

      {related.length > 0 && (
        <Card className="mt-6 border-foreground/25 shadow-none">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2">
              <ComponentIcon className="size-5 text-muted-foreground" />
              <CardTitle className="font-medium text-lg">Components</CardTitle>
            </div>
            <CardDescription>
              Components used in this block — open any to view or add to your project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-wrap gap-2">
              {related.map((item) => (
                <li key={item.name}>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/registry/${item.name}`}>{item.title}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
