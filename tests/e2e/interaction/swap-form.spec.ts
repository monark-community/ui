import { test, expect } from "@playwright/test"

test.describe("SwapForm interaction", () => {
  test("reverse button swaps from/to amounts", async ({ page }) => {
    await page.goto("/preview-snapshot/swap-form")
    await page.waitForLoadState("networkidle")

    const fromAmount = page.locator("#swap-from-amount")
    const toAmount = page.locator("#swap-to-amount")

    // Preview defaults: ETH 1.0  <->  USDC 2342.15
    await expect(fromAmount).toHaveValue("1.0")
    await expect(toAmount).toHaveValue("2342.15")

    await page.getByRole("button", { name: /reverse swap direction/i }).click()

    await expect(fromAmount).toHaveValue("2342.15")
    await expect(toAmount).toHaveValue("1.0")
  })

  test("renders the Swap label when status=ready", async ({ page }) => {
    await page.goto("/preview-snapshot/swap-form")
    await page.waitForLoadState("networkidle")

    // Preview default status is "ready" → primary label.
    const submit = page
      .getByRole("button")
      .filter({ hasText: /^Swap$/ })
      .first()
    await expect(submit).toBeEnabled()
  })

  test("settings button is accessible via its aria-label", async ({ page }) => {
    await page.goto("/preview-snapshot/swap-form")
    await page.waitForLoadState("networkidle")

    await expect(
      page.getByRole("button", { name: "Swap settings" })
    ).toBeVisible()
  })
})
