"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HardHatIcon, Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from 'next/navigation'

export function SiteHeader() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 w-full bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/helmetpro/logo.jpeg"
            alt="Logo"
            width={80}
            height={80}
            className="h-14 w-auto rounded-lg shadow-md"
          />
        </Link>

        {/* Desktop Navigation (Centered) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-10">
          {navLinks.map((link) => (
            <motion.div
              key={link.href}
              whileHover={{ y: -2 }}
              className="relative"
            >
              <Link
                href={link.href}
                className="text-lg font-medium text-gray-300 hover:text-blue-400 transition-colors"
              >
                {link.label}
              </Link>
              <motion.div
                className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-400 origin-left scale-x-0"
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </nav>

        {/* CTA Buttons & Mobile Menu Toggle */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/authentication')} 
            className="hidden md:inline-flex text-white hover:text-blue-400"
          >
            LogIn
          </Button>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hidden md:inline-flex">
            Partner With Us
          </Button>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            {isOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu (Animated Slide-in) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-16 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg border-t border-gray-800 md:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center py-6 space-y-6">
              {navLinks.map((link) => (
                <motion.div key={link.href} whileHover={{ scale: 1.05 }}>
                  <Link
                    href={link.href}
                    className="text-lg text-white hover:text-blue-400 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
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

// Navigation Links
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/join-us", label: "Join Us" },
]
