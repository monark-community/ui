"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

type Score = 0 | 1 | 2 | 3 | 4

const SEGMENT_COLOR: Record<Score, string> = {
  0: "bg-destructive/60",
  1: "bg-destructive/80",
  2: "bg-chart-3",
  3: "bg-chart-4",
  4: "bg-primary",
}

const DEFAULT_LEVELS: Record<Score, string> = {
  0: "Very weak",
  1: "Weak",
  2: "Fair",
  3: "Strong",
  4: "Very strong",
}

export interface PasswordStrengthMeterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Strength score from 0 (weakest) to 4 (strongest). */
  score: Score
  /**
   * Map of score to human-readable level label. Provide your own for
   * i18n; defaults to English ("Very weak" .. "Very strong").
   */
  levels?: Record<Score, string>
  /**
   * Format the label line. Receives the resolved level string.
   * Defaults to `"Strength: <level>"`.
   */
  formatLabel?: (level: string) => React.ReactNode
}

/**
 * Five-segment password strength indicator. Accepts a 0-4 score
 * (compatible with zxcvbn) and renders filled segments with
 * colour-coded feedback plus a text label.
 *
 * Fully controlled; the consumer owns the scoring logic.
 */
function PasswordStrengthMeter({
  score,
  levels = DEFAULT_LEVELS,
  formatLabel,
  className,
  ...props
}: PasswordStrengthMeterProps) {
  const activeColor = SEGMENT_COLOR[score]
  const filled = Math.max(1, score + 1)
  const level = levels[score]

  const label = formatLabel
    ? formatLabel(level)
    : (
        <span>
          Strength:{" "}
          <span className="text-foreground">{level}</span>
        </span>
      )

  return (
    <div
      data-slot="password-strength-meter"
      className={cn("space-y-1", className)}
      aria-live="polite"
      {...props}
    >
      <div className="flex gap-1">
        {([0, 1, 2, 3, 4] as const).map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i < filled ? activeColor : "bg-border",
            )}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  )
}

export { PasswordStrengthMeter, type Score as PasswordStrengthScore }
