"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HardHatIcon, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 p-2">
            <HardHatIcon className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">HelmetPro</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg text-gray-300 hover:text-blue-400 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hidden md:inline-flex text-white hover:text-blue-400">
            Partner With Us
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hidden md:inline-flex">
            Find Nearest Location
          </Button>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg border-t border-gray-800 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center py-6 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-lg text-white hover:text-blue-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button className="w-3/4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                Find Nearest Location
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

const navLinks = [
  { href: "#solutions", label: "Home" },
  { href: "#how-it-works", label: "Products" },
  { href: "#pricing", label: "Our Service" },
  { href: "#locations", label: "Join Us" },
]
