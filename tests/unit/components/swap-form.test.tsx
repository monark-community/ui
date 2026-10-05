import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { SwapForm } from "@/registry/new-york/blocks/swap-form/swap-form"

const TOKENS = [{ symbol: "ETH" }, { symbol: "USDC" }]
const base = {
  tokens: TOKENS,
  fromToken: "ETH",
  toToken: "USDC",
  fromAmount: "1",
  toAmount: "2342",
}

describe("SwapForm", () => {
  it("labels both amounts and names the form by its title", () => {
    render(<SwapForm {...base} />)
    expect(screen.getByRole("form", { name: "Swap" })).toBeInTheDocument()
    expect(screen.getByLabelText("You pay")).toHaveValue("1")
    expect(screen.getByLabelText("You receive")).toHaveValue("2342")
  })

  it("gives two forms on one page distinct field ids", () => {
    render(
      <>
        <SwapForm {...base} />
        <SwapForm {...base} />
      </>
    )
    const ids = screen.getAllByLabelText("You pay").map((el) => el.id)
    expect(new Set(ids).size).toBe(2)
  })

  it("translates every string through labels", () => {
    render(
      <SwapForm
        {...base}
        status="ready"
        rate="1 ETH = 2,342 USDC"
        onOpenSettings={() => {}}
        labels={{
          title: "Échanger",
          pay: "Vous payez",
          settings: "Réglages",
          rate: "Taux",
          status: { idle: "", quoting: "", ready: "Échanger", confirming: "", error: "" },
        }}
      />
    )
    expect(screen.getByRole("form", { name: "Échanger" })).toBeInTheDocument()
    expect(screen.getByLabelText("Vous payez")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Réglages" })).toBeInTheDocument()
    expect(screen.getByText("Taux")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Échanger" })).toBeEnabled()
  })

  it("hides the settings button without a handler", () => {
    render(<SwapForm {...base} />)
    expect(screen.queryByRole("button", { name: "Swap settings" })).toBeNull()
  })

  it("marks the submit button busy while confirming", () => {
    render(<SwapForm {...base} status="confirming" />)
    const submit = screen.getByRole("button", { name: /Confirming/ })
    expect(submit).toBeDisabled()
    expect(submit).toHaveAttribute("aria-busy", "true")
  })

  it("submits only when ready", () => {
    const onSwap = vi.fn()
    const { rerender } = render(<SwapForm {...base} status="idle" onSwap={onSwap} />)
    fireEvent.submit(screen.getByRole("form"))
    expect(onSwap).not.toHaveBeenCalled()
    rerender(<SwapForm {...base} status="ready" onSwap={onSwap} />)
    fireEvent.submit(screen.getByRole("form"))
    expect(onSwap).toHaveBeenCalledTimes(1)
  })

  it("announces the error as an alert", () => {
    render(<SwapForm {...base} status="error" errorMessage="Insufficient liquidity." />)
    expect(screen.getByRole("alert")).toHaveTextContent("Insufficient liquidity.")
  })
})
