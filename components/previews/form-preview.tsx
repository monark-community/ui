"use client"

import { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const schema = z.object({
  username: z
    .string()
    .min(2, "Username must be at least 2 characters")
    .max(20, "Must be 20 or fewer"),
})

export function FormPreview() {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  })

  const { values, entries } = useControls({
    label: { type: "text", default: "Username" },
    placeholder: { type: "text", default: "shadcn" },
    description: { type: "text", default: "This is your public display name." },
    showError: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  })

  // Show the error state without making the visitor submit an invalid value.
  useEffect(() => {
    if (values.showError) {
      form.setError("username", { message: "Username must be at least 2 characters" })
    } else {
      form.clearErrors("username")
    }
  }, [values.showError, form])

  return (
    <PreviewLayout controls={entries}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => alert(JSON.stringify(v, null, 2)))}
          className="w-full max-w-sm space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            disabled={values.disabled}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{values.label}</FormLabel>
                <FormControl>
                  <Input placeholder={values.placeholder} {...field} />
                </FormControl>
                {values.description && <FormDescription>{values.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={values.disabled}>
            Submit
          </Button>
        </form>
      </Form>
    </PreviewLayout>
  )
}
