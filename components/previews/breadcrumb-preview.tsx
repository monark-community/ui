"use client"

import { Fragment } from "react"
import { Dot, Slash } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const trail = ["Home", "Docs", "Components", "Navigation", "Breadcrumb"]

export function BreadcrumbPreview() {
  const { values, entries } = useControls({
    separator: { type: "select", options: ["chevron", "slash", "dot"], default: "chevron" },
    depth: { type: "number", default: 3, min: 2, max: 5 },
    collapsed: { type: "boolean", default: false },
  })

  const depth = Math.min(Math.max(Math.round(values.depth), 2), trail.length)
  // Keep the first and last segments; the default (depth 3) reads Home / Components / Breadcrumb.
  const crumbs =
    depth === 3 ? ["Home", "Components", "Breadcrumb"] : [...trail.slice(0, depth - 1), trail[trail.length - 1]]
  const middle = crumbs.slice(1, -1)
  // Collapsed: the ellipsis stands in for every middle segment but the last
  // one (all of them at depth 3: Home / … / Breadcrumb).
  const showEllipsis = values.collapsed && middle.length > 0

  const separator = (
    <BreadcrumbSeparator>
      {values.separator === "slash" ? <Slash /> : values.separator === "dot" ? <Dot /> : undefined}
    </BreadcrumbSeparator>
  )

  const shownMiddle = showEllipsis ? (middle.length > 1 ? middle.slice(-1) : []) : middle

  return (
    <PreviewLayout controls={entries}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">{crumbs[0]}</BreadcrumbLink>
          </BreadcrumbItem>
          {showEllipsis && (
            <>
              {separator}
              <BreadcrumbItem>
                <BreadcrumbEllipsis />
              </BreadcrumbItem>
            </>
          )}
          {shownMiddle.map((label) => (
            <Fragment key={label}>
              {separator}
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{label}</BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          ))}
          {separator}
          <BreadcrumbItem>
            <BreadcrumbPage>{crumbs[crumbs.length - 1]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </PreviewLayout>
  )
}
