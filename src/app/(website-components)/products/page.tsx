"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Check } from "lucide-react"
import { SiteHeader } from "../components/site-header"
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


export default function ProductsPage() {
  return (
    <div className="flex-1">
        <SiteHeader />
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-24">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30" variant="secondary">
              Our Solutions
            </Badge>
            <h1 className="text-4xl font-bold mb-6">Innovative Helmet Care Products</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Discover our range of cutting-edge helmet cleaning and maintenance solutions designed for modern riders.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-24">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6">
              <Badge>Featured Product</Badge>
              <h2 className="text-3xl font-bold">HelmetPro AI Cleaning Station</h2>
              <p className="text-muted-foreground">
                Our flagship product, the AI Cleaning Station, uses advanced technology to provide thorough, efficient,
                and eco-friendly helmet cleaning in just 15 minutes.
              </p>
              <ul className="space-y-2">
                {[
                  "AI-powered cleaning cycle",
                  "99.9% sanitization rate",
                  "Eco-friendly cleaning agents",
                  "Compatible with all helmet types",
                  "Built-in UV sterilization",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Learn More</Button>
            </div>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image src="/placeholder.svg" alt="HelmetPro AI Cleaning Station" fill className="object-cover" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Product Line</h2>
          {products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 * index }}
              className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-8 items-center mb-16 last:mb-0`}
            >
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-semibold">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
                <ul className="space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">Learn More</Button>
              </div>
              <div className="flex-1">
                <div className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg">
                  <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto max-w-7xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Ready to Revolutionize Your Helmet Care?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied riders who trust HelmetPro for their helmet cleaning and maintenance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      
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

const products = [
  {
    name: "HelmetPro Compact",
    description: "A portable cleaning solution for riders on the go.",
    image: "/placeholder.svg",
    features: ["Compact design", "Battery-powered", "15-min quick clean", "Travel-friendly"],
  },
  {
    name: "HelmetPro UV Sanitizer",
    description: "Advanced UV-C light technology for deep sanitization.",
    image: "/placeholder.svg",
    features: ["99.9% germ elimination", "Ozone-free", "360° coverage", "Automatic shut-off"],
  },
  {
    name: "HelmetPro Eco Cleaner",
    description: "Environmentally friendly cleaning solution for all helmet types.",
    image: "/placeholder.svg",
    features: ["Biodegradable", "Fragrance-free", "Anti-bacterial", "Visor-safe formula"],
  },
  {
    name: "HelmetPro Smart Deodorizer",
    description: "IoT-enabled device for continuous freshness.",
    image: "/placeholder.svg",
    features: ["App-controlled", "Customizable scents", "Battery life indicator", "Adaptive release"],
  },
  {
    name: "HelmetPro Pro Station",
    description: "Commercial-grade cleaning station for businesses.",
    image: "/placeholder.svg",
    features: ["Multi-helmet capacity", "Revenue tracking", "Remote diagnostics", "Customizable UI"],
  },
  {
    name: "HelmetPro Care Kit",
    description: "Complete helmet maintenance kit for home use.",
    image: "/placeholder.svg",
    features: ["Interior cleaner", "Exterior polish", "Microfiber cloths", "Visor anti-fog spray"],
  },
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