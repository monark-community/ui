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
import { PreviewLayout } from "@sntlr/registry-shell/shell/components/preview-layout"

export function NavigationMenuPreview() {
  return (
    <PreviewLayout>
      <NavigationMenu>
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
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
              <a href="#">Docs</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </PreviewLayout>
  )
}
