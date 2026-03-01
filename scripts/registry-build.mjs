#!/usr/bin/env node

/**
 * Build the shadcn registry, optionally overriding baseUrl for local dev.
 *
 * Usage:
 *   node scripts/registry-build.mjs                    # uses baseUrl from registry.json
 *   REGISTRY_URL=http://localhost:3000 node scripts/registry-build.mjs  # local override
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const REGISTRY_PATH = "registry.json";
const PUBLIC_R_DIR = "public/r";
const VERCEL_URL = "https://lumos-shadcn-ui-registry.vercel.app";

const override = process.env.REGISTRY_URL;
let original;

try {
  if (override) {
    original = readFileSync(REGISTRY_PATH, "utf8");
    const json = JSON.parse(original);
    json.baseUrl = override;
    writeFileSync(REGISTRY_PATH, JSON.stringify(json, null, 2) + "\n");
    console.log(`[registry-build] baseUrl → ${override}`);
  }

  execSync("npx shadcn@latest build", { stdio: "inherit" });

  // If using local override, rewrite all generated JSON files to use localhost URLs
  if (override) {
    const files = readdirSync(PUBLIC_R_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const filePath = join(PUBLIC_R_DIR, file);
      let content = readFileSync(filePath, "utf8");
      content = content.replace(new RegExp(VERCEL_URL, "g"), override);
      writeFileSync(filePath, content);
    }
    console.log(`[registry-build] Rewritten ${files.length} JSON files to use ${override}`);
  }
} finally {
  if (original) {
    writeFileSync(REGISTRY_PATH, original);
    console.log("[registry-build] baseUrl restored");
  }
}
