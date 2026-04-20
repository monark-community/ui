import { test, expect } from "@playwright/test"
import { getUiComponentNames } from "../_components"

const components = getUiComponentNames()

test.describe("Visual regression", () => {
  for (const name of components) {
    test(`${name} matches snapshot`, async ({ page }) => {
      // Isolated snapshot route — no canvas chrome, no zoom controls.
      await page.goto(`/preview-snapshot/${name}`)
      await page.waitForLoadState("networkidle")

      // Let any open-on-mount animations settle.
      await page.waitForTimeout(300)

      const target = page.locator("[data-snapshot-target]")
      await expect(target).toBeVisible({ timeout: 5000 })
      await expect(target).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0.01,
      })
    })
  }
})
