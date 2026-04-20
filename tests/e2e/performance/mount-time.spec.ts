import { test, expect } from "@playwright/test"

const perfTargets = [
  { name: "button", maxMs: 100 },
  { name: "input", maxMs: 100 },
  { name: "calendar", maxMs: 200 },
  { name: "chart", maxMs: 300 },
  { name: "command", maxMs: 200 },
  { name: "sidebar", maxMs: 200 },
  { name: "wallet", maxMs: 150 },
  { name: "connect-wallet", maxMs: 150 },
]

test.describe("Component mount performance", () => {
  for (const target of perfTargets) {
    test(`${target.name} mounts under ${target.maxMs}ms`, async ({ page }) => {
      const start = Date.now()
      await page.goto(`/components/${target.name}`)
      await page.waitForLoadState("networkidle")
      const loadTime = Date.now() - start

      const mountTime = await page.evaluate(() => {
        const entries = performance.getEntriesByType(
          "navigation"
        ) as PerformanceNavigationTiming[]
        if (entries.length > 0) {
          return entries[0].domContentLoadedEventEnd - entries[0].fetchStart
        }
        return 0
      })

      const measured = mountTime > 0 ? mountTime : loadTime
      console.log(`  ${target.name}: ${Math.round(measured)}ms`)

      // CI runners are significantly slower (cold Next.js dev server, shared
      // CPU); apply a 30x multiplier. Local runs use the tight thresholds.
      const multiplier = process.env.CI ? 30 : 1
      expect(measured).toBeLessThan(target.maxMs * multiplier)
    })
  }
})
