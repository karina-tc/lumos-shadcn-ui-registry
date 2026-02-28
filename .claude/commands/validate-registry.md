Validate the Lumos registry for structural integrity.

Run all the following checks and report results. Do NOT fix issues automatically — just report them.

## Check 1: File paths exist

Read `registry.json`. For every item, verify that each file `path` exists on disk. Report any missing files.

## Check 2: Unique names

Verify every item in `registry.json` has a unique `name`. Report any duplicates.

## Check 3: Registry dependencies resolve

For every `registryDependencies` entry:
- If it's a bare name (e.g., `"badge"`), it refers to a shadcn primitive — skip
- If it's a URL (e.g., `https://lumos-shadcn-ui-registry.vercel.app/r/{name}.json`), extract the name and verify a matching item exists in `registry.json`

Report any broken dependency references.

## Check 4: Demo index coverage

Read `src/app/demo/[name]/index.tsx`. For every key in the `demos` object, verify a matching `name` exists in `registry.json`. Also check the reverse — every `registry:block` and `registry:component` in registry.json should have a demo entry (registry:ui items are optional).

Report any mismatches.

## Check 5: Full-app block completeness

Read the `lumos-full-app` entry in `registry.json`. Verify:
- Every route in `full-app-layout.tsx`'s `routes` array has a corresponding page file in the `files` list
- Every page file in the `files` list has a corresponding route

Report any missing pages or routes.

## Check 6: Orphaned files

List all `.tsx` files in `src/components/` (excluding `src/components/ui/`). For each file, verify it's referenced by at least one item in `registry.json`. Report any orphaned files.

## Check 7: Build

Run `pnpm build`. Report whether the registry build step succeeded (ignore `next build` failures in environments without node_modules).

## Summary

Output a summary table:

```
| Check | Status | Details |
|-------|--------|---------|
| File paths | PASS/FAIL | N issues |
| Unique names | PASS/FAIL | N issues |
| Dependencies | PASS/FAIL | N issues |
| Demo coverage | PASS/FAIL | N issues |
| Full-app completeness | PASS/FAIL | N issues |
| Orphaned files | PASS/FAIL | N issues |
| Build | PASS/FAIL | - |
```

List all issues found below the table.
