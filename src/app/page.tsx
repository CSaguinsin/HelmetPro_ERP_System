"use client";

import { SiteHeader } from "../app/(website-components)/components/site-header";
import { HeroSection } from "../app/(website-components)/components/hero-section";
import { HowItWorks } from "../app/(website-components)/components/how-it-works";
import ContactSection from "../app/(website-components)/components/contact-us";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, MessageCircle } from "lucide-react";

import { TawkMessenger } from "./components/TawkMessenger";

// Removed unused import: Variants
// Removed unused variable: product

const stats = [
  { value: "100+", label: "Locations" },
  { value: "50K+", label: "Helmets Cleaned" },
  { value: "99.9%", label: "Sanitization Rate" },
  { value: "4.9/5", label: "Customer Rating" }
];

const footerLinks = [
  { title: "Company", links: ["About", "Careers", "Press", "Blog"] },
  { title: "Product", links: ["Features", "Pricing", "Security", "Enterprise"] },
  { title: "Resources", links: ["Documentation", "Support", "API", "Partner Program"] }
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <TawkMessenger />
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <HowItWorks />

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white">
          <motion.div
            className="container mx-auto max-w-7xl px-6 text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
              Trusted by Thousands of Riders
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat) => (
                <motion.div key={stat.label} className="text-center">
                  <motion.div className="text-4xl md:text-6xl font-bold mb-2">{stat.value}</motion.div>
                  <div className="text-base md:text-lg font-medium text-white/90">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <ContactSection />
      </main>

      <footer className="bg-slate-900 text-slate-200 py-12">
        <motion.div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div className="space-y-6">
              <Link href="/" className="inline-block">
                <Image src="/helmetpro/logo.jpeg" alt="HelmetPro Logo" width={80} height={80} className="h-14 w-auto rounded-lg shadow-md" />
              </Link>
              <p className="text-slate-400">The future of helmet cleaning and maintenance.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full" aria-label="Facebook">
                  <Facebook size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full" aria-label="Instagram">
                  <Instagram size={24} />
                </a>
                <a href="#" className="text-slate-400 hover:text-white p-2 hover:bg-slate-800 rounded-full" aria-label="Messenger">
                  <MessageCircle size={24} />
                </a>
              </div>
            </motion.div>

            {footerLinks.map((section) => (
              <motion.div key={section.title}>
                <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <motion.li key={link} whileHover={{ x: 5 }}>
                      <a href="#" className="text-slate-400 hover:text-white">{link}</a>
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
    </div>
  );
}
