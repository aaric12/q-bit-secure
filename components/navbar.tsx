"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LockKeyhole, Menu } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const routes = [
    { name: "Home", path: "/" },
    { name: "Information", path: "/info" },
    { name: "Simulation", path: "/simulation" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Configuration", path: "/configuration" },
    { name: "Analytics", path: "/analytics" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <LockKeyhole className="h-6 w-6" />
          <span className="font-bold inline-block">QBit Secure</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 ml-10">
          {routes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === route.path ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {route.name}
            </Link>
          ))}
        </nav>
        <div className="flex-1"></div>
        <ThemeToggle />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden ml-2">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link href="/" className="flex items-center space-x-2 mb-8">
              <LockKeyhole className="h-6 w-6" />
              <span className="font-bold inline-block">QBit Secure</span>
            </Link>
            <nav className="flex flex-col space-y-4">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === route.path ? "text-foreground" : "text-muted-foreground",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

