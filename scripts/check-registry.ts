/**
 * Fails when registry.json would produce a broken `npx shadcn add`: an
 * un-namespaced or unknown registryDependency, an npm import missing from
 * `dependencies`, or an import of another item's file that is not declared.
 * See scripts/lib/registry-deps.ts for the rules. Runs before `shadcn build`.
 */
import fs from "fs"
import path from "path"

import { checkRegistry, type Registry } from "./lib/registry-deps"

const ROOT = process.cwd()

const registry = JSON.parse(
  fs.readFileSync(path.join(ROOT, "registry.json"), "utf-8")
) as Registry

const errors = checkRegistry(registry, (file) => {
  const abs = path.join(ROOT, file)
  return fs.existsSync(abs) ? fs.readFileSync(abs, "utf-8") : undefined
})

if (errors.length > 0) {
  console.error(`registry.json has ${errors.length} dependency problem(s):\n`)
  for (const error of errors) console.error(`  - ${error}`)
  process.exit(1)
}

console.log(`registry.json: ${registry.items.length} items, dependencies OK`)
