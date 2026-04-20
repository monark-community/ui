"use client"

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

  return (
    <PreviewLayout>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((v) => alert(JSON.stringify(v, null, 2)))}
          className="w-full max-w-sm space-y-4"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </PreviewLayout>
  )
}
