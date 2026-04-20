import { test, expect } from "@playwright/test"

test.describe("ConnectWallet interaction", () => {
  test("connected trigger opens a dropdown with Disconnect", async ({ page }) => {
    await page.goto("/preview-snapshot/connect-wallet")
    await page.waitForLoadState("networkidle")

    // Preview default: status=connected, name=vitalik.eth
    const trigger = page.getByRole("button").first()
    await trigger.click()

    const menu = page.getByRole("menu")
    await expect(menu).toBeVisible()
    await expect(
      menu.getByRole("menuitem", { name: /disconnect/i })
    ).toBeVisible()
  })

  test("selecting Disconnect fires onDisconnect", async ({ page }) => {
    await page.goto("/preview-snapshot/connect-wallet")
    await page.waitForLoadState("networkidle")

    await page.getByRole("button").first().click()
    await page
      .getByRole("menu")
      .getByRole("menuitem", { name: /disconnect/i })
      .click()

    // The preview surfaces the most recent callback into a <p>.
    await expect(page.getByText("onDisconnect fired")).toBeVisible()
  })

  test("Escape closes the open menu", async ({ page }) => {
    await page.goto("/preview-snapshot/connect-wallet")
    await page.waitForLoadState("networkidle")

    await page.getByRole("button").first().click()
    await expect(page.getByRole("menu")).toBeVisible()

    await page.keyboard.press("Escape")
    await expect(page.getByRole("menu")).not.toBeVisible()
  })
})
