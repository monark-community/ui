"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function AccordionPreview() {
  const { values, entries } = useControls({
    variant: {
      type: "select",
      options: ["plus", "default"],
      default: "plus",
    },
    type: {
      type: "select",
      options: ["single", "multiple"],
      default: "single",
    },
    collapsible: { type: "boolean", default: true },
  })
  const plus = values.variant === "plus"

  return (
    <PreviewLayout controls={entries}>
      {/* The preview canvas shrink-wraps its child, so w-full would collapse:
          give the list an explicit width instead. */}
      <Accordion
        key={values.type}
        type={values.type as "single"}
        collapsible={values.collapsible}
        variant={values.variant as "plus" | "default"}
        className={plus ? "w-[min(48rem,calc(100vw-4rem))] border-y" : "w-[min(32rem,calc(100vw-4rem))]"}
      >
        <AccordionItem value="what">
          <AccordionTrigger>What is Monark?</AccordionTrigger>
          <AccordionContent>
            <p>
              Monark is a blockchain ecosystem that{" "}
              <strong>
                bridges the digital and physical worlds through open data,
                decentralized governance and reusable modules for dApps.
              </strong>{" "}
              We help developers, students and local communities build with
              transparency, efficiency and autonomy.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="different">
          <AccordionTrigger>
            How is Monark different from other blockchain projects?
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Monark puts <strong>real-world applications</strong> first:
              open data that anyone can use, governance that is actually
              decentralized, and modules you can reuse instead of rewriting.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="open-source">
          <AccordionTrigger>Is Monark an open-source platform?</AccordionTrigger>
          <AccordionContent>
            <p>
              Yes. Our code is on{" "}
              <strong>
                <a href="https://github.com/monark-community" target="_blank" rel="noreferrer">
                  GitHub
                </a>
              </strong>{" "}
              for everyone to read, use and contribute to.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="modules">
          <AccordionTrigger>What are Monark&apos;s reusable modules?</AccordionTrigger>
          <AccordionContent>
            <p>
              <strong>Pre-built, open-source smart contract components</strong>{" "}
              you plug into your application to save time and stay secure:
            </p>
            <ul>
              <li>
                <strong>Governance</strong> for collective decision-making
              </li>
              <li>
                <strong>Payments</strong> to simplify transactions
              </li>
              <li>
                <strong>Trust contacts</strong> for secure interactions
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="involved">
          <AccordionTrigger>How can I get involved?</AccordionTrigger>
          <AccordionContent>
            <p>
              Join the community on{" "}
              <strong>
                <a href="https://discord.gg/TvhrbFCp8T" target="_blank" rel="noreferrer">
                  Discord
                </a>
              </strong>
              , contribute to the repositories on GitHub, or share your ideas
              with the team. Students, developers, designers and writers are
              all welcome.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PreviewLayout>
  )
}
