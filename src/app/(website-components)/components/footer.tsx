"use client"

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Instagram, X } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DTILogo from "../../../../public/DTI.png"
import FDALogo from "../../../../public/FDA.png"

// Calendly component
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

export default function Footer() {
    const [showCalendly, setShowCalendly] = useState(false);
    
    const footerLinks = [
        {
            title: "Quick Links",
            links: [
                {name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Join Us", href: "/join-us" },
                { name: "Partner With Us", href: "#", isCalendly: true },
                { name: "Terms & Conditions", href: "/terms" }
            ]
        },
        {
            title: "Contact Us",
            links: [
                { name: "partnerships@helmetprosolutions.com", href: "mailto:partnerships@helmetprosolutions.com" },
                { name: "+63 962 816 4788", href: "tel:+63 962 816 4788" },
                { name: "Camella Springville Molino 3 Bacoor", href: "#" }
            ]
        },
    ];

    // Function to toggle Calendly modal
    const toggleCalendly = () => {
        setShowCalendly(!showCalendly);
    };

    // Fixed TypeScript error by providing explicit type for the event parameter
    const handleCalendlyOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setShowCalendly(true);
    };

    return (
        <footer className="bg-slate-900 text-slate-200 py-12 relative">
            <motion.div className="container max-w-screen-xl mx-auto px-4">
                <div className="grid md:grid-cols-4 gap-8">
                    <motion.div className="space-y-6">
                        <Link href="/" className="inline-block">
                            <Image src="/helmetpro/logo.jpeg" alt="HelmetPro Logo" width={80} height={80} className="h-14 w-auto rounded-lg shadow-md" />
                        </Link>
                        <p className="text-slate-400">The future of helmet cleaning and maintenance.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full"
                                aria-label="Facebook"
                                onClick={() => window.open("https://www.facebook.com/helmetprosolutions", "_blank")}
                            >
                                <Facebook size={24} />
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full"
                                aria-label="Instagram"
                                onClick={() => window.open("https://www.instagram.com/helmetpro_vendo/", "_blank")}
                            >
                                <Instagram size={24} />
                            </a>
                            <a
                                href="https://wa.me/639628164788"
                                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full"
                                aria-label="WhatsApp"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <FaWhatsapp size={24} />
                            </a>
                        </div>
                    </motion.div>

                    {footerLinks.map((section) => (
                        <motion.div key={section.title}>
                            <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <motion.li key={link.name} whileHover={{ x: 5 }}>
                                        {link.isCalendly ? (
                                            <a 
                                                href="#" 
                                                className="text-slate-400 hover:text-white"
                                                onClick={handleCalendlyOpen}
                                            >
                                                {link.name}
                                            </a>
                                        ) : section.title === "Quick Links" ? (
                                            <Link href={link.href} className="text-slate-400 hover:text-white">
                                                {link.name}
                                            </Link>
                                        ) : (
                                            <a href={link.href} className="text-slate-400 hover:text-white">
                                                {link.name}
                                            </a>
                                        )}
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div className="border-t border-slate-800 mt-12 pt-8 flex items-center justify-center space-x-4">
                    <Image src={DTILogo} alt="DTI Logo" width={50} height={50} className="h-10 w-auto" />
                    <p className="text-sm text-slate-400">© {new Date().getFullYear()} HelmetPro. All rights reserved.</p>
                    <Image src={FDALogo} alt="FDA Logo" width={50} height={50} className="h-10 w-auto" />
                </motion.div>
            </motion.div>

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
                                <h2 className="text-xl text-black font-bold">Schedule a Meeting</h2>
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
        </footer>
    )
}