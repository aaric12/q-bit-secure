"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Home, Info, BarChart3, LogIn, LogOut, Menu, X, Activity, Shield, Cpu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated, isLoading, logout } = useAuth()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Activity,
      active: pathname === "/dashboard",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
    },
    {
      href: "/simulation",
      label: "Simulation",
      icon: Cpu,
      active: pathname === "/simulation",
    },
    {
      href: "/security",
      label: "Security",
      icon: Shield,
      active: pathname === "/security",
    },
    {
      href: "/info",
      label: "Info",
      icon: Info,
      active: pathname === "/info",
    },
  ]

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <span className="text-lg font-bold">QBit Secure</span>
        </Link>

        <div className="hidden md:flex items-center space-x-1 ml-8">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                route.active ? "bg-primary/10 text-primary" : "hover:bg-muted",
              )}
            >
              <route.icon className="h-4 w-4 mr-2" />
              {route.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center ml-auto gap-2">
          <ThemeToggle />
          {!isLoading && (
            isAuthenticated ? (
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )
          )}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden p-4 border-t">
          <div className="flex flex-col space-y-3">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  route.active ? "bg-primary/10 text-primary" : "hover:bg-muted",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                <route.icon className="h-4 w-4 mr-2" />
                {route.label}
              </Link>
            ))}
            {!isLoading && (
              isAuthenticated ? (
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
