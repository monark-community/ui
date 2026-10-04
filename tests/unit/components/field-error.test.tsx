import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { FieldError } from "@/components/ui/field-error"

describe("FieldError", () => {
  it("renders nothing without a message", () => {
    const { container } = render(<FieldError />)
    expect(container).toBeEmptyDOMElement()
  })

  it("renders an alert with an aria-hidden icon", () => {
    render(<FieldError id="amount-error">Enter an amount above 0</FieldError>)
    const alert = screen.getByRole("alert")
    expect(alert).toHaveAttribute("id", "amount-error")
    expect(alert).toHaveTextContent("Enter an amount above 0")
    expect(alert.querySelector("[data-slot='field-error-icon']")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
    expect(alert.querySelector("svg")).not.toBeNull()
  })

  it("can hide the icon or replace it", () => {
    const { rerender } = render(<FieldError icon={false}>Oops</FieldError>)
    expect(screen.getByRole("alert").querySelector("svg")).toBeNull()
    rerender(<FieldError icon={<span data-testid="custom" />}>Oops</FieldError>)
    expect(screen.getByTestId("custom")).toBeInTheDocument()
  })

  it("reserves an empty live region when asked", () => {
    render(<FieldError reserveSpace />)
    const alert = screen.getByRole("alert")
    expect(alert).toBeEmptyDOMElement()
    expect(alert).toHaveClass("min-h-5")
  })

  it("describes the control that references it", () => {
    render(
      <>
        <input aria-label="Amount" aria-invalid aria-describedby="amount-error" />
        <FieldError id="amount-error">Too low</FieldError>
      </>
    )
    expect(screen.getByRole("textbox", { name: "Amount" })).toHaveAccessibleDescription(
      "Too low"
    )
  })
})
