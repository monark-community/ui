/**
 * Static check of registry.json against the source files each item ships.
 *
 * A consumer runs `npx shadcn add @monark/<item>` in their own app. The CLI
 * copies the item's files, installs the npm packages listed in its
 * `dependencies`, and recursively adds its `registryDependencies`. Anything a
 * file imports that is not covered by that is a broken install, so for every
 * item this checks that:
 *
 * - every `registryDependencies` entry is namespaced (`@monark/<name>`) and
 *   names an item that exists in this registry. A bare name like `wallet` is
 *   resolved against the default shadcn registry, not this one.
 * - every npm package a file imports is declared in `dependencies` of the item
 *   or of an item it pulls in through `registryDependencies` (transitively).
 * - every `@/...` import of another registry file (`@/components/ui/button`,
 *   `@/hooks/use-mobile`) points at an item listed in `registryDependencies`.
 * - no file uses a relative import outside its own item: the CLI rewrites
 *   `@/` aliases to the consumer's paths but leaves relative paths as-is.
 *
 * `react` and `react-dom` are the host app's, and `@/lib/utils` (`cn`, with
 * clsx + tailwind-merge) is created by `npx shadcn init`, which every install
 * starts from, the same convention as the upstream shadcn registry.
 */

export const NAMESPACE = "@monark"

/** Imports every consumer app already has. */
export const BASELINE_PACKAGES = new Set(["react", "react-dom"])

/** `@/` imports provided by `shadcn init` rather than by a registry item. */
export const BASELINE_ALIASES = new Set(["@/lib/utils"])

export interface RegistryFile {
  path: string
  type?: string
}

export interface RegistryItem {
  name: string
  type?: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

export interface Registry {
  items: RegistryItem[]
}

/** "recharts@2.15.4" -> "recharts", "@scope/pkg@^1" -> "@scope/pkg" */
export function packageNameOfDependency(dep: string): string {
  const at = dep.indexOf("@", dep.startsWith("@") ? 1 : 0)
  return at === -1 ? dep : dep.slice(0, at)
}

/** "lucide-react/icons" -> "lucide-react", "@radix-ui/react-slot" as-is */
export function packageNameOfImport(specifier: string): string {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

/** Module specifiers of every import / export-from / dynamic import. */
export function extractImports(source: string): string[] {
  const specifiers = new Set<string>()
  const patterns = [
    /\bimport\s+(?:type\s+)?[^'"]*?\bfrom\s*["']([^"']+)["']/g,
    /\bexport\s+(?:type\s+)?[^'"]*?\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ]
  // Drop comments so an example in a doc comment is not read as an import.
  const code = source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1")
  for (const pattern of patterns) {
    for (const match of code.matchAll(pattern)) specifiers.add(match[1])
  }
  return [...specifiers]
}

function stripExtension(p: string) {
  return p.replace(/\.(tsx?|jsx?|mjs|cjs)$/, "").replace(/\/index$/, "")
}

function posixJoin(dir: string, rel: string) {
  const out: string[] = []
  for (const seg of `${dir}/${rel}`.split("/")) {
    if (seg === "" || seg === ".") continue
    if (seg === "..") out.pop()
    else out.push(seg)
  }
  return out.join("/")
}

/**
 * Returns one human-readable error per problem; an empty array means every
 * item installs cleanly. `readFile` gets repo-relative posix paths and
 * returns the file content, or undefined when the file does not exist.
 */
export function checkRegistry(
  registry: Registry,
  readFile: (path: string) => string | undefined
): string[] {
  const errors: string[] = []
  const byName = new Map(registry.items.map((item) => [item.name, item]))

  // repo path without extension -> owning item
  const ownerOfPath = new Map<string, string>()
  for (const item of registry.items) {
    for (const file of item.files ?? []) {
      ownerOfPath.set(stripExtension(file.path), item.name)
    }
  }

  const resolveRegistryDep = (dep: string): RegistryItem | undefined =>
    dep.startsWith(`${NAMESPACE}/`)
      ? byName.get(dep.slice(NAMESPACE.length + 1))
      : undefined

  // item name -> npm packages available once it is installed
  const closureCache = new Map<string, Set<string>>()
  const packagesAvailable = (name: string, seen = new Set<string>()) => {
    const cached = closureCache.get(name)
    if (cached) return cached
    const packages = new Set<string>()
    const item = byName.get(name)
    if (!item || seen.has(name)) return packages
    seen.add(name)
    for (const dep of item.dependencies ?? []) {
      packages.add(packageNameOfDependency(dep))
    }
    for (const dep of item.registryDependencies ?? []) {
      const target = resolveRegistryDep(dep)
      if (!target) continue
      for (const pkg of packagesAvailable(target.name, seen)) packages.add(pkg)
    }
    closureCache.set(name, packages)
    return packages
  }

  for (const item of registry.items) {
    const where = `registry item "${item.name}"`

    const directRegistryDeps = new Set<string>()
    for (const dep of item.registryDependencies ?? []) {
      if (!dep.startsWith(`${NAMESPACE}/`)) {
        errors.push(
          `${where}: registryDependency "${dep}" is not namespaced; use "${NAMESPACE}/${dep.replace(/^.*\//, "")}" (a bare name resolves against the default shadcn registry)`
        )
        continue
      }
      const target = resolveRegistryDep(dep)
      if (!target) {
        errors.push(
          `${where}: registryDependency "${dep}" does not match any item in registry.json`
        )
        continue
      }
      directRegistryDeps.add(target.name)
    }

    const available = packagesAvailable(item.name)

    for (const file of item.files ?? []) {
      const source = readFile(file.path)
      if (source === undefined) {
        errors.push(`${where}: file "${file.path}" does not exist`)
        continue
      }
      const fileDir = file.path.split("/").slice(0, -1).join("/")

      for (const specifier of extractImports(source)) {
        if (specifier.startsWith(".")) {
          const target = stripExtension(posixJoin(fileDir, specifier))
          if (ownerOfPath.get(target) === item.name) continue
          errors.push(
            `${where}: ${file.path} imports "${specifier}" by relative path; use the "@/..." alias so the shadcn CLI can rewrite it`
          )
          continue
        }

        if (specifier.startsWith("@/")) {
          if (BASELINE_ALIASES.has(specifier)) continue
          const owner = ownerOfPath.get(stripExtension(specifier.slice(2)))
          if (!owner) {
            errors.push(
              `${where}: ${file.path} imports "${specifier}", which is not a file of any registry item`
            )
          } else if (owner !== item.name && !directRegistryDeps.has(owner)) {
            errors.push(
              `${where}: ${file.path} imports "${specifier}" but registryDependencies does not list "${NAMESPACE}/${owner}"`
            )
          }
          continue
        }

        const pkg = packageNameOfImport(specifier)
        if (BASELINE_PACKAGES.has(pkg) || pkg.startsWith("node:")) continue
        if (!available.has(pkg)) {
          errors.push(
            `${where}: ${file.path} imports "${pkg}" but it is not in the dependencies of the item or of its registryDependencies`
          )
        }
      }
    }
  }

  return errors
}
