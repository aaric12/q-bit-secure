import Link from "next/link"
import { LockKeyhole } from "lucide-react"

export function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-16">
        <div className="flex items-center space-x-2">
          <LockKeyhole className="h-5 w-5" />
          <span className="text-sm font-medium">QBit Secure</span>
        </div>
        <nav className="flex gap-4 md:gap-6 text-sm">
          <Link href="/about" className="text-muted-foreground hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} QBit Secure. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
