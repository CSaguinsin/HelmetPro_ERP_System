"use client"

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Facebook, Instagram } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
    const footerLinks = [
        {
            title: "Quick Links",
            links: [
                {name: "Home", href: "/" },
                { name: "About", href: "/about" },
                { name: "Products", href: "/products" },
                { name: "Join Us", href: "/join-us" },
                { name: "Partner With Us", href: "https://docs.google.com/forms/d/e/1FAIpQLSc_isim53g1u6-pYQRLzhk75UUQjFSYdkI9_wYUrgZCABmH8A/viewform" }
            ]
        },
        {
            title: "Contact Us",
            links: [
                { name: "partnerships@helmetprosolutions.com", href: "mailto:partnerships@helmetprosolutions.com" },
                { name: "+63-962-753-3915", href: "tel:+63-962-753-3915" },
                { name: "Camella Springville Molino 3 Bacoor", href: "#" }
            ]
        },
    ];

    return (
        <footer className="bg-slate-900 text-slate-200 py-12">
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
                                href="https://wa.me/639627533915"
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
                                        {section.title === "Quick Links" ? (
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

                <motion.div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
                    <p className="text-sm">© {new Date().getFullYear()} HelmetPro. All rights reserved.</p>
                </motion.div>
            </motion.div>
        </footer>
    )
}