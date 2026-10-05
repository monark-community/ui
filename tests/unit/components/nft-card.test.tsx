import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { NftCard } from "@/registry/new-york/blocks/nft-card/nft-card"

const traits = [
  { type: "Background", value: "Blue", rarity: 12.5 },
  { type: "Body", value: "Cosmic" },
  { type: "Eyes", value: "Laser" },
]

describe("NftCard", () => {
  it("renders the name, image alt and rarity", () => {
    render(<NftCard name="Monark #1" image="/x.png" traits={traits} />)
    expect(screen.getByRole("heading", { name: "Monark #1" })).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Monark #1")
    expect(screen.getByText("12.5% have this")).toBeInTheDocument()
  })

  it("counts hidden traits", () => {
    render(<NftCard name="n" image="/x.png" traits={traits} maxTraits={1} />)
    expect(screen.getByText("+2 more traits")).toBeInTheDocument()
  })

  it("translates the trait strings", () => {
    render(
      <NftCard
        name="n"
        image="/x.png"
        traits={traits}
        maxTraits={1}
        rarityLabel={(p) => `${p} % l'ont`}
        moreTraitsLabel={(n) => `+${n} autres`}
      />
    )
    expect(screen.getByText("12.5 % l'ont")).toBeInTheDocument()
    expect(screen.getByText("+2 autres")).toBeInTheDocument()
  })
})
