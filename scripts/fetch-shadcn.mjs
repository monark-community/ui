#!/usr/bin/env node
/**
 * One-shot script: fetch every shadcn component from the canonical
 * registry at ui.shadcn.com/r/styles/new-york/{name}.json, write each
 * `files[].content` into `components/ui/*.tsx` (and `hooks/*.ts` if
 * present), collect registry metadata, and rewrite the root
 * `registry.json` with an items[] entry per component.
 *
 * Run once when spinning up the registry. Re-runs refresh component
 * sources to track shadcn upstream — components that have been
 * customized locally would be overwritten, so use with care after
 * initial scaffolding.
 */
import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..")

const STYLE = "new-york"
const BASE = `https://ui.shadcn.com/r/styles/${STYLE}`

// Canonical list of shadcn/ui v4 components (no blocks). If shadcn
// adds new ones, append here and re-run the script.
const COMPONENTS = [
  "accordion",
  "alert",
  "alert-dialog",
  "aspect-ratio",
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "carousel",
  "chart",
  "checkbox",
  "collapsible",
  "command",
  "context-menu",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "hover-card",
  "input",
  "input-otp",
  "label",
  "menubar",
  "navigation-menu",
  "pagination",
  "popover",
  "progress",
  "radio-group",
  "resizable",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "slider",
  "sonner",
  "switch",
  "table",
  "tabs",
  "textarea",
  "toggle",
  "toggle-group",
  "tooltip",
]

function titleCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

async function fetchItem(name) {
  const res = await fetch(`${BASE}/${name}.json`, {
    headers: { accept: "application/json" },
  })
  if (!res.ok) {
    throw new Error(`${name}: HTTP ${res.status}`)
  }
  return res.json()
}

async function writeFile(relPath, content) {
  const abs = path.join(ROOT, relPath)
  await fs.mkdir(path.dirname(abs), { recursive: true })
  await fs.writeFile(abs, content, "utf-8")
}

async function main() {
  const items = []
  const summary = { ok: 0, failed: 0, skipped: 0 }

  for (const name of COMPONENTS) {
    try {
      process.stdout.write(`  · ${name.padEnd(20)} `)
      const upstream = await fetchItem(name)

      // Normalize files: shadcn ships paths like "ui/button.tsx" — we
      // want them landing at components/ui/button.tsx. Hooks land at
      // hooks/use-*.ts. Blocks/examples we drop (components-only).
      const localFiles = []
      for (const file of upstream.files ?? []) {
        let targetRel
        const type = file.type ?? ""
        const baseName = path.basename(file.path ?? file.target ?? "")

        if (type === "registry:ui" || type === "registry:component") {
          targetRel = `components/ui/${baseName}`
        } else if (type === "registry:hook") {
          targetRel = `hooks/${baseName}`
        } else if (type === "registry:lib") {
          targetRel = `lib/${baseName}`
        } else {
          // Skip blocks, pages, files we don't mirror as components.
          continue
        }

        await writeFile(targetRel, file.content)
        localFiles.push({ path: targetRel, type })
      }

      if (localFiles.length === 0) {
        console.log("(no files to mirror)")
        summary.skipped++
        continue
      }

      items.push({
        name,
        type: "registry:ui",
        title: upstream.title ?? titleCase(name),
        description: upstream.description ?? "",
        ...(upstream.dependencies?.length
          ? { dependencies: upstream.dependencies }
          : {}),
        ...(upstream.registryDependencies?.length
          ? { registryDependencies: upstream.registryDependencies }
          : {}),
        files: localFiles,
      })
      summary.ok++
      console.log("✓")
    } catch (err) {
      summary.failed++
      console.log(`✗ ${err.message}`)
    }
  }

  // Preserve existing theme item at top of registry.json; append/refresh
  // component items after.
  const registryPath = path.join(ROOT, "registry.json")
  const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"))
  const existingNonComponents = (registry.items ?? []).filter(
    (i) => i.type !== "registry:ui" && i.type !== "registry:component",
  )
  registry.items = [...existingNonComponents, ...items]
  await fs.writeFile(
    registryPath,
    JSON.stringify(registry, null, 2) + "\n",
    "utf-8",
  )

  console.log(
    `\n✓ ${summary.ok} mirrored, ${summary.skipped} skipped, ${summary.failed} failed`,
  )
  console.log(`  registry.json updated with ${items.length} component items`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
