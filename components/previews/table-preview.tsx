"use client"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const INVOICES = [
  { id: "Invoice #001", status: "Paid", amount: 250 },
  { id: "Invoice #002", status: "Pending", amount: 150 },
  { id: "Invoice #003", status: "Overdue", amount: 350 },
  { id: "Invoice #004", status: "Paid", amount: 450 },
  { id: "Invoice #005", status: "Paid", amount: 550 },
  { id: "Invoice #006", status: "Pending", amount: 200 },
]

const usd = (n: number) => `$${n.toFixed(2)}`

export function TablePreview() {
  const { values, entries } = useControls({
    rows: { type: "number", default: 3, min: 1, max: INVOICES.length },
    caption: { type: "boolean", default: false },
    footer: { type: "boolean", default: false },
  })

  const rows = INVOICES.slice(0, values.rows)
  const total = rows.reduce((sum, row) => sum + row.amount, 0)

  return (
    <PreviewLayout controls={entries}>
      <Table>
        {values.caption && <TableCaption>A list of your recent invoices.</TableCaption>}
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell className="text-right">{usd(row.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        {values.footer && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">{usd(total)}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </PreviewLayout>
  )
}
