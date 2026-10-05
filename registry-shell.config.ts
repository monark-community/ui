import { defineConfig } from "@sntlr/registry-shell"

export default defineConfig({
  branding: {
    siteName: "Monark UI",
    shortName: "UI",
    siteUrl: "https://ui.monark.io",
    description:
      "Monark's component library — shadcn-compatible, Radix-primitive, ready for Web3 product surfaces.",
    github: {
      owner: "monark-community",
      repo: "ui",
      label: "Github",
      showStars: true,
    },
    logoAlt: "Monark",
    // Favicons: drop your files in public/ and reference them here.
    // Defaults below assume you'll add public/favicon.ico etc.
    faviconDark: "/favicon_dark.svg",
    faviconLight: "/favicon_light.svg",
    faviconIco: "/favicon.ico",
  },

  paths: {
    // Font + @import overrides for Nunito Sans (heading + body).
    // Imported at the end of the shell's globals.css so Monark tokens win.
    globalCss: "./styles/theme.css",
  },

  // Sidebar grouping for the components section, in display order. Every
  // component belongs to exactly one group (tests/unit/registry/categories
  // checks this), so nothing falls back into the shell's catch-all "Base".
  categories: {
    Actions: ["button", "toggle", "toggle-group"],
    Forms: [
      "input",
      "input-group",
      "input-otp",
      "textarea",
      "label",
      "checkbox",
      "radio-group",
      "switch",
      "slider",
      "select",
      "native-select",
      "calendar",
      "form",
      "field-error",
      "password-strength-meter",
    ],
    Overlays: [
      "dialog",
      "alert-dialog",
      "sheet",
      "drawer",
      "popover",
      "hover-card",
      "tooltip",
      "info-tip",
      "dropdown-menu",
      "context-menu",
      "command",
      "image-crop-dialog",
    ],
    Navigation: [
      "tabs",
      "breadcrumb",
      "pagination",
      "menubar",
      "navigation-menu",
      "sidebar",
    ],
    Layout: [
      "card",
      "separator",
      "aspect-ratio",
      "resizable",
      "scroll-area",
      "accordion",
      "collapsible",
      "disclosure",
      "carousel",
      "section-heading",
      "section-divider",
    ],
    "Data display": [
      "table",
      "chart",
      "stat",
      "badge",
      "avatar",
      "role-chip",
      "trusted-device-card",
    ],
    Feedback: ["alert", "sonner", "progress", "skeleton", "empty"],
    Web3: [
      "wallet",
      "connect-wallet",
      "token-amount",
      "network-badge",
      "tx-status",
      "tx-feedback",
      "wallet-prompt",
    ],
    // The standard chrome every Monark-branded site shares.
    "Site shell": [
      "site-header",
      "site-brand",
      "site-footer",
      "header-action",
      "demo-chip",
      "locale-switch",
      "theme-toggle",
      "disclaimer",
    ],
    // Pieces of the demo apps behind "Launch demo".
    "Demo app": ["app-tabs", "app-loading", "demo-controls"],
  },

  // Versioned docs: every v* tag gets a frozen site at /v/<version>/ and
  // frozen registry JSON at /r/v<version>/; the latest stays at / and /r/.
  // Each tag is built with its own registry:build (check + shadcn build).
  versions: {
    registryBuildCommand: "pnpm registry:build",
  },

  // The header theme button becomes a panel (mode, primary color, surface
  // tint, Copy CSS). Only from 1.0.0: older themes don't derive their
  // surfaces from --primary and --surface-tint.
  themePanel: { since: "1.0.0" },

  // Docs live under content/docs/{locale}/ once you add translations. With
  // multilocale off (default), MDX lives directly under content/docs/.
})
