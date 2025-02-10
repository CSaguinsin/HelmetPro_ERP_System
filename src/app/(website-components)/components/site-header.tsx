import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HardHatIcon } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
            <HardHatIcon className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">HelmetPro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="#solutions" className="text-sm hover:text-blue-500 transition-colors">
            Solutions
          </Link>
          <Link href="#how-it-works" className="text-sm hover:text-blue-500 transition-colors">
            How It Works
          </Link>
          <Link href="#pricing" className="text-sm hover:text-blue-500 transition-colors">
            Pricing
          </Link>
          <Link href="#locations" className="text-sm hover:text-blue-500 transition-colors">
            Locations
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden sm:inline-flex">
            Partner With Us
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Find Nearest Location</Button>
        </div>
      </div>
    </header>
  )
}

