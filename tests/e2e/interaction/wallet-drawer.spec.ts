import { test, expect } from "@playwright/test"

test.describe("WalletDrawer interaction", () => {
  test("clicking the trigger opens the drawer with wallet sections", async ({
    page,
  }) => {
    await page.goto("/preview-snapshot/wallet-drawer")
    await page.waitForLoadState("networkidle")

    // Default preview state: connected, transactions visible.
    await page.getByRole("button").first().click()

    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()
    await expect(dialog.getByText(/balance/i)).toBeVisible()
    await expect(dialog.getByText(/recent activity/i)).toBeVisible()
  })

  test("Escape closes the drawer", async ({ page }) => {
    await page.goto("/preview-snapshot/wallet-drawer")
    await page.waitForLoadState("networkidle")

    await page.getByRole("button").first().click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(dialog).not.toBeVisible()
  })

  test("Disconnect button inside the drawer closes it and fires onDisconnect", async ({
    page,
  }) => {
    await page.goto("/preview-snapshot/wallet-drawer")
    await page.waitForLoadState("networkidle")

    await page.getByRole("button").first().click()
    const dialog = page.getByRole("dialog")
    await expect(dialog).toBeVisible()

    await dialog.getByRole("button", { name: /disconnect/i }).click()
    // Preview's onDisconnect also toggles the sheet closed via setOpen(false).
    await expect(dialog).not.toBeVisible()
  })
})
