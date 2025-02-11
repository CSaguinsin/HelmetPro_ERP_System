"use client"

import { SiteHeader } from "../app/(website-components)/components/site-header"
import { HeroSection } from "../app/(website-components)/components/hero-section"
import { HowItWorks } from "../app/(website-components)/components/how-it-works"
import { PricingSection } from "../app/(website-components)/components/pricing-section"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"


const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
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
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <h2 className="text-5xl font-extrabold tracking-tight mb-12">Trusted by Thousands of Riders</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center"
              variants={fadeInUp}
            >
              <motion.div
                className="text-6xl font-bold mb-2"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-lg font-medium text-white/90">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>

        <PricingSection />

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <h2 className="text-5xl font-extrabold tracking-tight mb-6">Get in Touch</h2>
        <p className="text-lg text-gray-300 mb-12">We're here to help! Reach out to us for support or partnership inquiries.</p>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div>
            <div className="space-y-6">
              {[
                { icon: MapPin, text: "Find locations near you" },
                { icon: Mail, text: "support@helmetpro.com" },
                { icon: Phone, text: "(555) 123-4567" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-4 text-lg">
                  <Icon className="h-6 w-6 text-blue-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg">
            <form className="space-y-6">
              <input type="text" placeholder="Name" className="w-full p-4 rounded-lg bg-gray-800 border-gray-600 text-white" />
              <input type="email" placeholder="Email" className="w-full p-4 rounded-lg bg-gray-800 border-gray-600 text-white" />
              <textarea placeholder="Message" rows={4} className="w-full p-4 rounded-lg bg-gray-800 border-gray-600 text-white" />
              <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                Send Message
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
      </main>

      <footer className="bg-slate-900 text-slate-200 py-12">
        <motion.div 
          className="container flex-1 max-w-screen-xl mx-auto px-4"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerChildren}
        >
          <div className="grid md:grid-cols-4 gap-8">
            <motion.div variants={fadeInUp}>
              <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="flex items-center">
                  <Image
                    src="/helmetpro/logo.jpeg"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="h-14 w-auto rounded-lg shadow-md" // Changed from h-20 to h-14
                  />
                </Link>
              </div>
              <p className="text-slate-400">The future of helmet cleaning and maintenance.</p>
            </motion.div>
            {footerLinks.map((section) => (
              <motion.div key={section.title} variants={fadeInUp}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <motion.li 
                      key={link}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div 
            className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400"
            variants={fadeInUp}
          >
            © {new Date().getFullYear()} HelmetPro. All rights reserved.
          </motion.div>
        </motion.div>
      </footer>
    </div>
  )
}

const stats = [
  { value: "100+", label: "Locations" },
  { value: "50K+", label: "Helmets Cleaned" },
  { value: "99.9%", label: "Sanitization Rate" },
  { value: "4.9/5", label: "Customer Rating" },
]

const footerLinks = [
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Blog"],
  },
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "Enterprise"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Support", "API", "Partner Program"],
  },
]