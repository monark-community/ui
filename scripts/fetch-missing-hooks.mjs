#!/usr/bin/env node
/**
 * Follow-up to fetch-shadcn.mjs: scan every component's
 * registryDependencies for anything that looks like a hook (`use-*`) or
 * lib utility (`utils`, `cn`, etc.), fetch those items from shadcn, and
 * mirror them into hooks/ or lib/ as appropriate.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..")
const BASE = "https://ui.shadcn.com/r/styles/new-york"

async function fetchItem(name) {
  const res = await fetch(`${BASE}/${name}.json`)
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`)
  return res.json()
}

async function main() {
  const registryPath = path.join(ROOT, "registry.json")
  const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"))

  // Gather all registryDependencies from existing items
  const deps = new Set()
  for (const item of registry.items ?? []) {
    for (const d of item.registryDependencies ?? []) {
      deps.add(d)
    }
  }

  // Keep only candidates that LOOK like a hook/lib (not a URL, not a
  // component we already have, and either starts with `use-` or is a
  // known utility name).
  const have = new Set((registry.items ?? []).map((i) => i.name))
  const UTILS = new Set(["utils"])
  const candidates = [...deps].filter((d) => {
    if (d.startsWith("http")) return false
    if (have.has(d)) return false
    if (d.startsWith("use-")) return true
    if (UTILS.has(d)) return true
    return false
  })

  if (candidates.length === 0) {
    console.log("No missing hooks/utils to fetch.")
    return
  }

  const added = []
  for (const name of candidates) {
    try {
      const item = await fetchItem(name)
      const localFiles = []
      for (const file of item.files ?? []) {
        const base = path.basename(file.path ?? file.target ?? "")
        let rel
        if (file.type === "registry:hook") rel = `hooks/${base}`
        else if (file.type === "registry:lib") rel = `lib/${base}`
        else continue
        await fs.mkdir(path.join(ROOT, path.dirname(rel)), { recursive: true })
        await fs.writeFile(path.join(ROOT, rel), file.content, "utf-8")
        localFiles.push({ path: rel, type: file.type })
      }
      if (localFiles.length === 0) continue
      added.push({
        name,
        type: item.type,
        title: item.title ?? name,
        description: item.description ?? "",
        ...(item.dependencies?.length ? { dependencies: item.dependencies } : {}),
        files: localFiles,
      })
      console.log(`  ✓ ${name} (${localFiles.length} file${localFiles.length === 1 ? "" : "s"})`)
    } catch (err) {
      console.log(`  ✕ ${name}: ${err.message}`)
    }
  }

  registry.items = [...(registry.items ?? []), ...added]
  await fs.writeFile(registryPath, JSON.stringify(registry, null, 2) + "\n", "utf-8")
  console.log(`\n✓ ${added.length} hook/util item(s) added to registry.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
