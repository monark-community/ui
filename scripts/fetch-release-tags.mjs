#!/usr/bin/env node
/**
 * Makes the release tags (v*) available to `registry-shell build`, which
 * builds a frozen snapshot of every tagged version.
 *
 * CI checkouts often can't see tags: Vercel clones shallow, may have no
 * `origin` remote, or may ship the source without a .git directory. This
 * script handles all three by fetching straight from the public GitHub URL,
 * and prints what it found so the build log explains a missing version.
 * It never fails the build: without tags, registry-shell builds the latest
 * version only.
 *
 *   node scripts/fetch-release-tags.mjs
 */
import { spawnSync } from "node:child_process"

const REPO_URL = process.env.RELEASE_TAGS_REPO ?? "https://github.com/monark-community/ui.git"
const log = (msg) => console.log(`[release-tags] ${msg}`)

function git(args, { quiet = false } = {}) {
  const r = spawnSync("git", args, { encoding: "utf8", stdio: quiet ? "pipe" : ["ignore", "pipe", "pipe"] })
  return { ok: r.status === 0, out: (r.stdout ?? "").trim(), err: (r.stderr ?? "").trim() }
}

function tags() {
  const r = git(["tag", "--list", "v*"], { quiet: true })
  return r.ok && r.out ? r.out.split(/\r?\n/) : []
}

try {
  if (!git(["--version"], { quiet: true }).ok) {
    log("git is not installed; building the latest version only.")
    process.exit(0)
  }

  if (!git(["rev-parse", "--git-dir"], { quiet: true }).ok) {
    // No repository at all (source uploaded without .git): create an empty
    // one to hold the tags. registry-shell checks tags out into temporary
    // worktrees, so the working tree itself is left untouched.
    log("no git repository; initialising one to hold the release tags.")
    if (!git(["init", "-q"]).ok) throw new Error("git init failed")
  }

  const shallow = git(["rev-parse", "--is-shallow-repository"], { quiet: true }).out === "true"
  log(`repository found (shallow: ${shallow}); local release tags before fetch: ${tags().length}.`)

  const refspec = "+refs/tags/v*:refs/tags/v*"
  let r = git(["fetch", "--quiet", "--force", ...(shallow ? ["--unshallow"] : []), REPO_URL, refspec])
  if (!r.ok && shallow) {
    // --unshallow can fail on partial clones; tags alone are enough.
    log(`unshallow fetch failed (${r.err.split("\n")[0]}); retrying without it.`)
    r = git(["fetch", "--quiet", "--force", REPO_URL, refspec])
  }
  if (!r.ok) {
    log(`could not fetch tags from ${REPO_URL}: ${r.err.split("\n")[0]}`)
    log("building the latest version only.")
    process.exit(0)
  }

  const found = tags()
  log(`release tags available: ${found.length ? found.join(", ") : "none"}.`)
} catch (err) {
  log(`unexpected error: ${err.message}; building the latest version only.`)
}
