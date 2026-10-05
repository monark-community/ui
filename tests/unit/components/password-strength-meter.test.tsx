import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  PasswordStrengthMeter,
  type PasswordStrengthScore,
} from "@/components/ui/password-strength-meter"

const cases: [PasswordStrengthScore, string, string, string][] = [
  [0, "Very weak", "text-destructive", "bg-destructive"],
  [
    1,
    "Weak",
    "text-destructive",
    "bg-[color-mix(in_oklch,var(--destructive),var(--warning))]",
  ],
  [2, "Fair", "text-warning", "bg-warning"],
  [3, "Strong", "text-success", "bg-success"],
  [4, "Very strong", "text-success", "bg-success"],
]

describe("PasswordStrengthMeter", () => {
  it.each(cases)(
    "score %i shows %s in a monotonic token colour",
    (score, level, text, bg) => {
      const { container } = render(<PasswordStrengthMeter score={score} />)
      const label = container.querySelector(
        "[data-slot='password-strength-level']"
      )
      expect(label).toHaveTextContent(level)
      expect(label).toHaveClass(text)
      const segments = container.querySelectorAll(
        "[data-slot='password-strength-meter'] > div > span"
      )
      expect(segments).toHaveLength(5)
      const filled = Math.max(1, score + 1)
      segments.forEach((seg, i) => {
        expect(seg).toHaveClass(i < filled ? bg : "bg-border")
      })
    }
  )

  it("adds a decorative check only at the top score", () => {
    const { container, rerender } = render(<PasswordStrengthMeter score={3} />)
    expect(container.querySelector("svg")).toBeNull()
    rerender(<PasswordStrengthMeter score={4} />)
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("is a polite live region and honours formatLabel", () => {
    render(
      <PasswordStrengthMeter score={2} formatLabel={(l) => "Niveau : " + l} />
    )
    expect(
      screen.getByText("Niveau : Fair").closest("[aria-live]")
    ).toHaveAttribute("aria-live", "polite")
  })
})
