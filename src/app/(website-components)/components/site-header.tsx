"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from 'next/navigation'

// Create a Calendly component that loads the script properly in Next.js
interface CalendlyProps {
  url: string;
}

const Calendly: React.FC<CalendlyProps> = ({ url }) => {
  useEffect(() => {
    // Load the Calendly script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="calendly-inline-widget" 
      data-url={url}
      style={{ minWidth: "320px", height: "700px" }}>
    </div>
  );
};

export function SiteHeader() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [showCalendly, setShowCalendly] = useState(false)

  // Function to toggle Calendly modal
  const toggleCalendly = () => {
    setShowCalendly(!showCalendly);
    if (isOpen) setIsOpen(false); // Close mobile menu if open
  };

  return (
    <>
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

          {/* Desktop Navigation */}
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
            <Button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hidden md:inline-flex"
              onClick={toggleCalendly}
            >
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
                <div className="flex flex-col w-3/4 gap-4">
                  {/* <Button 
                    variant="ghost" 
                    onClick={() => {
                      router.push('/authentication')
                      setIsOpen(false)
                    }}
                    className="text-white hover:text-blue-400"
                  >
                    LogIn
                  </Button> */}
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                    onClick={() => {
                      toggleCalendly();
                      setIsOpen(false);
                    }}
                  >
                    Partner With Us
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Calendly Modal */}
      <AnimatePresence>
        {showCalendly && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-auto"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Schedule a Meeting</h2>
                <Button variant="ghost" onClick={toggleCalendly} className="p-1">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <div className="p-0">
                <Calendly url="https://calendly.com/admin-helmetprosolutions/30min" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Navigation Links
interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Product" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/join-us", label: "Join Us" },
]