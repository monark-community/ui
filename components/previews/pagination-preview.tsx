"use client"

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function PaginationPreview() {
  const { values, entries } = useControls({
    pages: { type: "number", default: 3, min: 1, max: 7 },
    current: { type: "number", default: 2, min: 1, max: 7 },
    showEllipsis: { type: "boolean", default: true },
    showPrevNext: { type: "boolean", default: true },
  })

  const pages = Array.from({ length: values.pages }, (_, i) => i + 1)

  return (
    <PreviewLayout controls={entries}>
      <Pagination>
        <PaginationContent>
          {values.showPrevNext && (
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
          )}
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink href="#" isActive={page === values.current}>
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {values.showEllipsis && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {values.showPrevNext && (
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </PreviewLayout>
  )
}
