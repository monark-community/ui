"use client"

import * as React from "react"
import { ArrowDownIcon, Loader2Icon, SettingsIcon } from "lucide-react"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/ui/field-error"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SwapToken {
  /** Unique symbol key; used as the Select option value. */
  symbol: string
  /** Display name, e.g. "Ether". */
  name?: string
  /** Optional icon element rendered before the symbol in the Select. */
  icon?: React.ReactNode
}

export interface SwapFormValues {
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  slippageBps: number
}

type SwapStatus = "idle" | "quoting" | "ready" | "confirming" | "error"

/** Every visible and accessible string, for translation. */
export interface SwapFormLabels {
  title: string
  settings: string
  reverse: string
  pay: string
  receive: string
  /** Token picker name, read after the field label ("You pay, token"). */
  token: string
  rate: string
  networkFee: string
  /** Receives the slippage as a percentage string, e.g. "0.50". */
  minimumReceived: (slippagePercent: string) => string
  status: Record<SwapStatus, string>
}

const DEFAULT_LABELS: SwapFormLabels = {
  title: "Swap",
  settings: "Swap settings",
  reverse: "Reverse swap direction",
  pay: "You pay",
  receive: "You receive",
  token: "token",
  rate: "Rate",
  networkFee: "Network fee",
  minimumReceived: (pct) => `Min. received (${pct}% slippage)`,
  status: {
    idle: "Enter an amount",
    quoting: "Fetching quote…",
    ready: "Swap",
    confirming: "Confirming…",
    error: "Try again",
  },
}

export interface SwapFormProps extends React.HTMLAttributes<HTMLFormElement> {
  /** Tokens available in both the from-token and to-token selects. */
  tokens: SwapToken[]
  /** Controlled "from" token symbol. */
  fromToken: string
  /** Controlled "to" token symbol. */
  toToken: string
  /** Controlled "from" amount (as a string so consumers can pass wei / base units). */
  fromAmount: string
  /** Controlled "to" amount; typically derived from a quote. */
  toAmount: string
  /** Slippage tolerance in basis points (e.g. 50 = 0.5%). */
  slippageBps?: number
  /** Estimated exchange rate label; e.g. "1 ETH = 2,342 USDC". */
  rate?: React.ReactNode
  /** Estimated network fee; e.g. "$1.23". */
  networkFee?: React.ReactNode
  /** Minimum received after slippage; e.g. "2,318 USDC". */
  minimumReceived?: React.ReactNode
  /** Button state: "idle" | "quoting" | "ready" | "confirming" | "error". */
  status?: SwapStatus
  /** Optional error message rendered under the form. */
  errorMessage?: React.ReactNode
  onFromTokenChange?: (symbol: string) => void
  onToTokenChange?: (symbol: string) => void
  onFromAmountChange?: (value: string) => void
  onToAmountChange?: (value: string) => void
  onSlippageChange?: (bps: number) => void
  /** User reversed the from / to direction. */
  onReverse?: () => void
  /** User triggered the swap. */
  onSwap?: () => void
  /** Clicked the settings icon; consumer renders the slippage UI. */
  onOpenSettings?: () => void
  /** Button label; defaults depend on status. */
  swapLabel?: React.ReactNode
  /** Translated strings; anything left out falls back to English. */
  labels?: Partial<SwapFormLabels>
}

function SwapForm({
  tokens,
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  slippageBps = 50,
  rate,
  networkFee,
  minimumReceived,
  status = "idle",
  errorMessage,
  onFromTokenChange,
  onToTokenChange,
  onFromAmountChange,
  onToAmountChange,
  onSlippageChange: _onSlippageChange,
  onReverse,
  onSwap,
  onOpenSettings,
  swapLabel,
  labels: labelOverrides,
  className,
  ...props
}: SwapFormProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides }
  const id = React.useId()
  const isBusy = status === "quoting" || status === "confirming"
  const isDisabled = status === "idle" || isBusy

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isDisabled && onSwap) onSwap()
  }

  return (
    <form
      data-slot="swap-form"
      aria-labelledby={`${id}-title`}
      className={cn(
        "flex w-full max-w-md flex-col gap-4 rounded-3xl border bg-card p-5 text-card-foreground sm:p-6",
        className
      )}
      onSubmit={handleSubmit}
      {...props}
    >
      <header className="flex items-center justify-between">
        <h3 id={`${id}-title`} className="text-lg font-extrabold">
          {labels.title}
        </h3>
        {onOpenSettings && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onOpenSettings}
            aria-label={labels.settings}
          >
            <SettingsIcon />
          </Button>
        )}
      </header>

      <div className="flex flex-col">
        <TokenField
          id={`${id}-from`}
          label={labels.pay}
          tokenLabel={labels.token}
          token={fromToken}
          amount={fromAmount}
          tokens={tokens}
          onTokenChange={onFromTokenChange}
          onAmountChange={onFromAmountChange}
        />

        {/* Overlaps both fields, as the reverse button does in most swap UIs. */}
        <div className="relative z-10 -my-3 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="bg-card"
            onClick={onReverse}
            aria-label={labels.reverse}
          >
            <ArrowDownIcon />
          </Button>
        </div>

        <TokenField
          id={`${id}-to`}
          label={labels.receive}
          tokenLabel={labels.token}
          token={toToken}
          amount={toAmount}
          tokens={tokens}
          readOnly
          onTokenChange={onToTokenChange}
          onAmountChange={onToAmountChange}
        />
      </div>

      {(rate || networkFee || minimumReceived) && (
        <dl className="flex flex-col gap-1.5 px-1 text-sm">
          {rate && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{labels.rate}</dt>
              <dd className="text-right font-semibold tabular-nums">{rate}</dd>
            </div>
          )}
          {networkFee && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">{labels.networkFee}</dt>
              <dd className="text-right font-semibold tabular-nums">
                {networkFee}
              </dd>
            </div>
          )}
          {minimumReceived && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">
                {labels.minimumReceived((slippageBps / 100).toFixed(2))}
              </dt>
              <dd className="text-right font-semibold tabular-nums">
                {minimumReceived}
              </dd>
            </div>
          )}
        </dl>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isDisabled}
        aria-busy={isBusy || undefined}
        data-status={status}
      >
        {isBusy && <Loader2Icon className="animate-spin" aria-hidden="true" />}
        {swapLabel ?? labels.status[status]}
      </Button>

      {status === "error" && errorMessage && (
        <FieldError>{errorMessage}</FieldError>
      )}
    </form>
  )
}

function TokenField({
  id,
  label,
  tokenLabel,
  token,
  amount,
  tokens,
  readOnly,
  onTokenChange,
  onAmountChange,
}: {
  id: string
  label: string
  tokenLabel: string
  token: string
  amount: string
  tokens: SwapToken[]
  readOnly?: boolean
  onTokenChange?: (symbol: string) => void
  onAmountChange?: (value: string) => void
}) {
  const inputId = `${id}-amount`

  return (
    // The amount input is borderless, so the whole panel shows the focus ring.
    <div
      data-slot="swap-form-field"
      className="flex flex-col gap-1.5 rounded-2xl border bg-background p-4 transition-[color,box-shadow] has-[input:focus-visible]:border-ring has-[input:focus-visible]:ring-3 has-[input:focus-visible]:ring-ring/50"
    >
      <Label htmlFor={inputId} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-3">
        <input
          id={inputId}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="w-full min-w-0 bg-transparent text-2xl font-extrabold tabular-nums outline-none placeholder:text-muted-foreground"
        />
        <Select value={token} onValueChange={onTokenChange}>
          <SelectTrigger
            size="sm"
            aria-label={`${label}, ${tokenLabel}`}
            className="w-auto min-w-28 shrink-0"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {tokens.map((t) => (
              <SelectItem key={t.symbol} value={t.symbol}>
                <span className="flex items-center gap-2">
                  {t.icon && (
                    <span
                      aria-hidden="true"
                      className="flex size-4 items-center justify-center *:size-full"
                    >
                      {t.icon}
                    </span>
                  )}
                  <span className="font-bold">{t.symbol}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export { SwapForm }
