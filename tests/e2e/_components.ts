import fs from "node:fs"
import path from "node:path"

interface RegistryItem {
  name: string
  type: string
}

/**
 * Read the component list from registry.json so e2e specs don't hardcode
 * names; adding a component to registry.json automatically enrolls it in
 * the a11y + visual suites.
 */
function loadRegistry(): RegistryItem[] {
  const p = path.resolve(__dirname, "../../registry.json")
  const raw = JSON.parse(fs.readFileSync(p, "utf8")) as { items: RegistryItem[] }
  return raw.items
}

export function getUiComponentNames(): string[] {
  return loadRegistry()
    .filter((i) => i.type === "registry:ui")
    .map((i) => i.name)
    .sort()
}
