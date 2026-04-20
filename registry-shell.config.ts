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

  // Sidebar grouping for the components section. Web3-specific primitives get
  // their own collapsible sub-section; everything else renders flat below.
  categories: {
    Web3: [
      "wallet",
      "connect-wallet",
      "token-amount",
      "network-badge",
      "tx-status",
    ],
  },

  // Docs live under content/docs/{locale}/ once you add translations. With
  // multilocale off (default), MDX lives directly under content/docs/.
})
