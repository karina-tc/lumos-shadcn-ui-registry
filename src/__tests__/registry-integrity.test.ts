import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import registry from "../../registry.json";

const ROOT = resolve(__dirname, "../..");

describe("registry.json integrity", () => {
  const items = registry.items;

  it("every item has a unique name", () => {
    const names = items.map((i) => i.name);
    const dupes = names.filter((n, idx) => names.indexOf(n) !== idx);
    expect(dupes).toEqual([]);
  });

  it("every file path exists on disk", () => {
    const missing: string[] = [];
    for (const item of items) {
      if (!item.files) continue;
      for (const file of item.files) {
        const abs = resolve(ROOT, file.path);
        if (!existsSync(abs)) {
          missing.push(`${item.name}: ${file.path}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });

  it("no duplicate file targets within a single item", () => {
    const dupes: string[] = [];
    for (const item of items) {
      if (!item.files) continue;
      const targets = item.files.map((f) => f.target).filter(Boolean);
      const seen = new Set<string>();
      for (const t of targets) {
        if (seen.has(t!)) {
          dupes.push(`${item.name}: duplicate target ${t}`);
        }
        seen.add(t!);
      }
    }
    expect(dupes).toEqual([]);
  });

  it("every URL registryDependency references a valid item name", () => {
    const allNames = new Set(items.map((i) => i.name));
    const broken: string[] = [];

    for (const item of items) {
      const deps = (item as { registryDependencies?: string[] })
        .registryDependencies;
      if (!deps) continue;

      for (const dep of deps) {
        // Only check our own registry URLs
        if (!dep.startsWith("https://lumos-shadcn-ui-registry")) continue;

        // Extract name from URL: /r/{name}.json → name
        const match = dep.match(/\/r\/([^/]+)\.json$/);
        if (!match) {
          broken.push(`${item.name}: malformed URL ${dep}`);
          continue;
        }
        const depName = match[1];
        if (!allNames.has(depName)) {
          broken.push(`${item.name}: references ${depName} which doesn't exist`);
        }
      }
    }
    expect(broken).toEqual([]);
  });

  it("lumos-full-app block has all expected page targets", () => {
    const fullApp = items.find((i) => i.name === "lumos-full-app");
    expect(fullApp).toBeDefined();

    const targets = fullApp!.files!.map((f) => f.target).filter(Boolean);

    // Must have root layout + home page
    expect(targets).toContain("app/layout.tsx");
    expect(targets).toContain("app/page.tsx");

    // Must have at least 10 route pages (we have 14)
    const routePages = targets.filter(
      (t) => t !== "app/layout.tsx" && t !== "app/page.tsx",
    );
    expect(routePages.length).toBeGreaterThanOrEqual(10);
  });
});
