"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useState } from "react"

// Navigation menu configuration
const navItems = [
  {
    title: "Home",
    href: "/",
    children: null,
  },
  {
    title: "About",
    href: "/about",
    children: [
      {
        title: "About Us",
        href: "/about",
        description: "Learn more about our company and mission",
      },
      {
        title: "About Us",
        href: "/about",
        description: "Learn more about our company and mission",
      },
      {
        title: "About Us",
        href: "/about",
        description: "Learn more about our company and mission",
      },
    ],
  },
  {
    title: "Contact",
    href: "/contact",
    children: [
        {
          title: "About Us",
          href: "/about",
          description: "Learn more about our company and mission",
        },
        {
          title: "About Us",
          href: "/about",
          description: "Learn more about our company and mission",
        },
        {
          title: "About Us",
          href: "/about",
          description: "Learn more about our company and mission",
        },
      ],
  },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  
  return (
    <header className="w-full border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            Payload Tailwind
          </Link>
          
          {/* Desktop Navigation - hidden on mobile */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
                          {item.children.map((child) => (
                            <div key={child.title} className="grid gap-1">
                              <NavigationMenuLink asChild>
                                <Link
                                  href={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{child.title}</div>
                                  {child.description && (
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {child.description}
                                    </p>
                                  )}
                                </Link>
                              </NavigationMenuLink>
                            </div>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link href={item.href} className={navigationMenuTriggerStyle()}>
                        {item.title}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {/* Mobile Menu Button - visible only on mobile */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <button
                className="inline-flex items-center justify-center rounded-md p-2 text-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary"
                aria-label="Open main menu"
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] p-0 md:hidden [&>button]:hidden">
              <div className="h-full flex flex-col py-6">
                {/* Custom close button matching the open button style */}
                <div className="px-6 mb-4 flex justify-end">
                  <SheetClose asChild>
                    <button
                      className="inline-flex items-center justify-center rounded-md p-2 text-foreground bg-secondary hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-secondary"
                      aria-label="Close main menu"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </SheetClose>
                </div>
                
                <nav className="flex-1 overflow-y-auto px-6">
                  <Accordion type="single" collapsible className="w-full space-y-1">
                    {navItems.map((item, i) => (
                      item.children ? (
                        <AccordionItem key={item.title} value={`item-${i}`} className="border-0">
                          <AccordionTrigger className="py-2 text-base font-medium hover:no-underline">
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent className="pb-1">
                            <div className="flex flex-col space-y-2">
                              {item.children.map((child) => (
                                <Link
                                  key={child.title}
                                  href={child.href}
                                  className="py-2 transition-colors"
                                  onClick={() => setOpen(false)}
                                >
                                  <div className="text-sm font-medium">{child.title}</div>
                                  {child.description && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {child.description}
                                    </p>
                                  )}
                                </Link>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ) : (
                        <div key={item.title} className="py-2">
                          <Link
                            href={item.href}
                            className="block text-base font-medium hover:text-primary transition-colors"
                            onClick={() => setOpen(false)}
                          >
                            {item.title}
                          </Link>
                        </div>
                      )
                    ))}
                  </Accordion>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
} 