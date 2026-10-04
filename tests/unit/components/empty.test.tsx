import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

function renderEmpty(props: React.ComponentProps<typeof Empty> = {}) {
  return render(
    <Empty {...props}>
      <EmptyMedia>
        <svg data-testid="icon" />
      </EmptyMedia>
      <EmptyHeader>
        <EmptyTitle>No bounties yet</EmptyTitle>
        <EmptyDescription>Post the first one.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <button type="button">Post a bounty</button>
      </EmptyContent>
    </Empty>
  )
}

describe("Empty", () => {
  it("renders title, description and action", () => {
    renderEmpty()
    expect(screen.getByText("No bounties yet")).toBeInTheDocument()
    expect(screen.getByText("Post the first one.")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Post a bounty" })).toBeInTheDocument()
  })

  it("draws a dashed border and sets data-slot on every part", () => {
    const { container } = renderEmpty()
    expect(container.querySelector("[data-slot='empty']")).toHaveClass("border-dashed")
    for (const slot of ["empty-media", "empty-header", "empty-title", "empty-description", "empty-content"]) {
      expect(container.querySelector(`[data-slot='${slot}']`)).not.toBeNull()
    }
  })

  it("hides the media from assistive tech", () => {
    renderEmpty()
    expect(screen.getByTestId("icon").closest("[data-slot='empty-media']")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
  })

  it("defaults to centred alignment and accepts start", () => {
    const { container, rerender } = renderEmpty()
    const root = () => container.querySelector("[data-slot='empty']")!
    expect(root()).toHaveAttribute("data-align", "center")
    expect(root()).toHaveClass("items-center")
    rerender(
      <Empty align="start">
        <EmptyTitle>x</EmptyTitle>
      </Empty>
    )
    expect(root()).toHaveAttribute("data-align", "start")
    expect(root()).toHaveClass("items-start")
  })

  it("passes role through so filtered-away results can be announced", () => {
    renderEmpty({ role: "status" })
    expect(screen.getByRole("status")).toHaveTextContent("No bounties yet")
  })

  it("has no live region by default", () => {
    renderEmpty()
    expect(screen.queryByRole("status")).toBeNull()
  })
})
