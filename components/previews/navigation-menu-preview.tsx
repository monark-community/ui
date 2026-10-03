"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { useControls } from "@sntlr/registry-shell/shell/hooks/use-controls"
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

const componentLinks = [
  { title: "Wallet", description: "Address with avatar, name and copy action." },
  { title: "Token Amount", description: "Formats on-chain integers with decimals." },
  { title: "Network Badge", description: "Chain name with its brand icon." },
  { title: "Tx Status", description: "Pending, confirmed or failed transaction." },
]

export function NavigationMenuPreview() {
  const { values, entries } = useControls({
    showComponentsMenu: { type: "boolean", default: false },
    showDocsLink: { type: "boolean", default: true },
    delayDuration: { type: "number", default: 200, min: 0, max: 1000 },
  })

  return (
    <PreviewLayout controls={entries}>
      <NavigationMenu delayDuration={values.delayDuration}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-muted p-6 no-underline outline-none focus:shadow-md"
                      href="#"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">Monark UI</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Web3-native components, copy-paste installable.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a className="block rounded-md p-3 hover:bg-accent" href="#">
                      <div className="text-sm font-medium">Install</div>
                      <p className="text-xs text-muted-foreground">
                        Run the shadcn CLI, pick components.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a className="block rounded-md p-3 hover:bg-accent" href="#">
                      <div className="text-sm font-medium">Theming</div>
                      <p className="text-xs text-muted-foreground">
                        Customize tokens or stick with the defaults.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {values.showComponentsMenu && (
            <NavigationMenuItem>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-4 md:w-[400px] md:grid-cols-2">
                  {componentLinks.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuLink asChild>
                        <a className="block rounded-md p-3 hover:bg-accent" href="#">
                          <div className="text-sm font-medium">{link.title}</div>
                          <p className="text-xs text-muted-foreground">{link.description}</p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )}
          {values.showDocsLink && (
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <a href="#">Docs</a>
              </NavigationMenuLink>
            </NavigationMenuItem>
          )}
        </NavigationMenuList>
      </NavigationMenu>
    </PreviewLayout>
  )
}
