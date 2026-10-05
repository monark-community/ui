"use client"

import * as React from "react"

import { cn } from "cn"

type Score = 0 | 1 | 2 | 3 | 4

// Monotonic red -> amber -> green scale built from the status tokens. The
// segment count and the text label carry the level; colour reinforces it.
const SEGMENT_COLOR: Record<Score, string> = {
  0: "bg-destructive",
  1: "bg-[color-mix(in_oklch,var(--destructive),var(--warning))]",
  2: "bg-warning",
  3: "bg-success",
  4: "bg-success",
}

// Level text colours; each meets 4.5:1 on background and card in both themes.
const LEVEL_TEXT: Record<Score, string> = {
  0: "text-destructive",
  1: "text-destructive",
  2: "text-warning",
  3: "text-success",
  4: "text-success",
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
          <span
            data-slot="password-strength-level"
            className={cn(
              "inline-flex items-center gap-0.5 font-semibold",
              LEVEL_TEXT[score]
            )}
          >
            {level}
            {score === 4 ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : null}
          </span>
        </span>
      )

  return (
    <div
      data-slot="password-strength-meter"
      data-score={score}
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
