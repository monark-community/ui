"use client"

import * as React from "react"
import { cn } from "cn"
import { Accordion as AccordionPrimitive } from "radix-ui"
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react"

// `variant="plus"` is the Monark FAQ style from monark.io: large bold
// questions, a + that turns into × when open, and muted answers kept to a
// readable line length.
function Accordion({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> & {
  variant?: "default" | "plus"
}) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      data-variant={variant}
      className={cn("group/accordion flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between gap-4 rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground group-data-[variant=plus]/accordion:min-h-14 group-data-[variant=plus]/accordion:items-center group-data-[variant=plus]/accordion:py-4 group-data-[variant=plus]/accordion:text-lg group-data-[variant=plus]/accordion:font-bold group-data-[variant=plus]/accordion:hover:text-primary-ink group-data-[variant=plus]/accordion:hover:no-underline group-data-[variant=plus]/accordion:**:data-[slot=accordion-trigger-icon]:size-5 group-data-[variant=plus]/accordion:**:data-[slot=accordion-trigger-icon]:text-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon
          data-slot="accordion-trigger-icon"
          aria-hidden
          className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden group-data-[variant=plus]/accordion:hidden"
        />
        <ChevronUpIcon
          data-slot="accordion-trigger-icon"
          aria-hidden
          className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline group-data-[variant=plus]/accordion:hidden!"
        />
        <PlusIcon
          data-slot="accordion-trigger-icon"
          aria-hidden
          className="pointer-events-none hidden shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-45 group-data-[variant=plus]/accordion:inline"
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up group-data-[variant=plus]/accordion:text-base group-data-[variant=plus]/accordion:text-muted-foreground"
      {...props}
    >
      <div
        className={cn(
          "h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4 group-data-[variant=plus]/accordion:max-w-[68ch] group-data-[variant=plus]/accordion:pb-5",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
