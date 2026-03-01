#!/usr/bin/env node

/**
 * Build the shadcn registry, optionally overriding baseUrl for local dev.
 *
 * Usage:
 *   node scripts/registry-build.mjs                    # uses baseUrl from registry.json
 *   REGISTRY_URL=http://localhost:3000 node scripts/registry-build.mjs  # local override
 */

import { readFileSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const REGISTRY_PATH = "registry.json";

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
} finally {
  if (original) {
    writeFileSync(REGISTRY_PATH, original);
    console.log("[registry-build] baseUrl restored");
  }
}
