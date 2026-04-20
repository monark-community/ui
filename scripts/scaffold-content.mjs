#!/usr/bin/env node
/**
 * One-shot scaffolder: reads registry.json, generates a minimal preview
 * wrapper (`components/previews/<name>-preview.tsx`) and a minimal a11y
 * YAML (`content/a11y/<name>.yaml`) for every component item.
 *
 * Idempotent — if either file already exists, it's left alone. Run once
 * after adding components; authors then enhance previews/YAMLs by hand.
 */
import fs from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, "..")

const PREVIEWS_DIR = path.join(ROOT, "components", "previews")
const A11Y_DIR = path.join(ROOT, "content", "a11y")

function pascalCase(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("")
}

/**
 * Fallback preview — intentionally does NOT import the real component.
 * Shadcn components export different shapes (named, default, multi-part
 * namespaced like Dialog.Root/Dialog.Content) that can't be auto-guessed
 * from the slug alone. This placeholder keeps the build green for every
 * component; authors replace each with a real preview as they mature.
 */
function previewTemplate(name, title) {
  const Pascal = pascalCase(name)
  return `"use client"

import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

/**
 * Auto-scaffolded preview stub for ${title}. Replace with a real demo —
 * see @sntlr/registry's button-preview.tsx for the useControls + variant
 * knob pattern.
 */
export function ${Pascal}Preview() {
  return (
    <PreviewLayout>
      <div className="text-sm text-muted-foreground p-8 text-center">
        Preview for <code className="font-mono">${name}</code> — TBD.
      </div>
    </PreviewLayout>
  )
}
`
}

/** Minimal a11y YAML — placeholder with sensible defaults. */
function a11yTemplate(name, title) {
  return `component: ${title}
wcag: AA
standard: WAI-ARIA 1.2
element: ${name}
role: TODO
delegatesTo: null
description: >
  Auto-scaffolded a11y stub for ${title}. Fill in the real role / keyboard
  interactions / focus behavior based on the component's implementation.

keyboard: []

focus:
  visible: true
  trapped: false
  notes: null

screenReader:
  announcements: []
  notes: null

contrast:
  text: "Meets WCAG AA when used with the default theme tokens"
  ui: "Meets WCAG AA when used with the default theme tokens"

motion:
  reducedMotion: All transitions respect prefers-reduced-motion

consumerResponsibilities: []
`
}

async function main() {
  const registryPath = path.join(ROOT, "registry.json")
  const registry = JSON.parse(await fs.readFile(registryPath, "utf-8"))

  const components = (registry.items ?? []).filter(
    (i) => i.type === "registry:ui" || i.type === "registry:component",
  )

  await fs.mkdir(PREVIEWS_DIR, { recursive: true })
  await fs.mkdir(A11Y_DIR, { recursive: true })

  let previewsCreated = 0
  let previewsSkipped = 0
  let a11yCreated = 0
  let a11ySkipped = 0

  for (const item of components) {
    const { name } = item
    const title = item.title ?? name

    // Preview
    const previewPath = path.join(PREVIEWS_DIR, `${name}-preview.tsx`)
    if (existsSync(previewPath)) {
      previewsSkipped++
    } else {
      await fs.writeFile(previewPath, previewTemplate(name, title), "utf-8")
      previewsCreated++
    }

    // A11y YAML
    const a11yPath = path.join(A11Y_DIR, `${name}.yaml`)
    if (existsSync(a11yPath)) {
      a11ySkipped++
    } else {
      await fs.writeFile(a11yPath, a11yTemplate(name, title), "utf-8")
      a11yCreated++
    }
  }

  console.log(
    `✓ previews: created ${previewsCreated}, skipped ${previewsSkipped} existing`,
  )
  console.log(
    `✓ a11y yamls: created ${a11yCreated}, skipped ${a11ySkipped} existing`,
  )
  console.log(`  (${components.length} components in registry.json)`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
