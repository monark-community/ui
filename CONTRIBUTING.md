# Contributing to Monark UI



Thank you for your interest in contributing to **Monark UI**! We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, and code.

By contributing, you agree to the following terms:

---

## 1. How to Contribute

1. **Fork the repository** and create your feature branch:

```bash
git checkout -b feature/my-feature
```

2. **Make your changes** following our [code style guidelines](#code-style).  

3. **Commit your changes** with clear [conventional](https://www.conventionalcommits.org/en/v1.0.0) messages:

```bash
git commit -m "feat: add short descriptive message"
```

4. **Push your branch** to your fork:

```bash
git push origin feature/my-feature
```

5. **Open a pull request** against the `main` branch of this repository.

---

### What belongs here

Before you add a component, variant or prop, read the [Component Guidelines](https://ui.monark.io/docs/component-guidelines). In short: an item needs at least two Monark sites that use it, no product-specific knowledge, and plain props (no i18n library, router, store or network calls). Product visuals, page sections and the adapters that wire a site's state into an item stay in that site. Prefer a slot or prop on an existing item over a new one.

---

## 2. Code Style

- Follow the existing project code style.
- Include comments where necessary to explain complex logic.
- Run tests locally before submitting.

---

## 3. Releases

The registry is versioned with [Changesets](https://changesets.dev). It is not published to npm: a release is a version bump, a [CHANGELOG](./CHANGELOG.md) entry, a `v<version>` git tag and a GitHub release.

**Every PR that changes what the registry ships** (a component, block, hook, the theme, or a registry item's files or dependencies) must include a changeset:

```bash
pnpm changeset
```

Pick the bump and write one or two lines for consumers; commit the generated `.changeset/*.md` file with your PR. Docs-only, test-only and tooling changes don't need one.

What each bump means for a component registry:

- **major**: breaking, visually or in the API. A renamed or removed component, prop or CSS variable; a change to the theme tokens or defaults that alters how existing installs look.
- **minor**: backwards-compatible additions. A new component, block or hook; a new prop, variant or token.
- **patch**: fixes that keep the API and intended look. Bug, a11y and typing fixes; small style corrections.

Merged changesets accumulate in a **Version packages** PR opened by the release workflow. Merging that PR bumps the version, updates `CHANGELOG.md`, and tags and releases `v<version>`.

---

## 4. Reporting Issues

- Use the **Issues** tab to report bugs or request features.
- Include steps to reproduce, expected behavior, and screenshots if applicable.

---

## 5. Legal Considerations

- By contributing, you agree that your contributions will be licensed under the terms of the [LICENSE](./LICENSE).
- Your contributions become part of **16918140 Canada Inc. (Monark Inc.)**’s project.  

> Example copyright notice for contributions:
>
> ```text
> Copyright \[Year] \[Contributor Name]
> Licensed under the Apache License, Version 2.0
> ```

- **Do not submit code you do not have the right to contribute**.

- **Note:** Including a copyright notice is only necessary for contributions that add significant value, such as core business logic, important decentralized features, or substantial code changes.

---

## 6. Code of Conduct

We expect all contributors to follow a respectful and collaborative approach. Please see `CODE\_OF\_CONDUCT.md` for details.

---

Thank you for helping improve **Monark UI**! Your contributions are highly appreciated.

