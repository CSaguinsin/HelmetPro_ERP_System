"use client"

import { SiteHeader } from "../app/(website-components)/components/site-header"
import { HeroSection } from "../app/(website-components)/components/hero-section"
import { HowItWorks } from "../app/(website-components)/components/how-it-works"
import { PricingSection } from "../app/(website-components)/components/pricing-section"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone, Sparkles, ShieldCheck, Zap, Timer } from "lucide-react"
import { motion, Variants } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useState, FormEvent } from "react"
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TawkMessenger } from './components/TawkMessenger'

const product = {
  name: "HelmetPro UV Sanitizer Pro",
  tagline: "The Future of Helmet Care",
  description: "Advanced UV-C sanitization technology that eliminates 99.9% of bacteria and odors in minutes. Experience the next generation of helmet cleaning with our professional-grade sanitizer.",
  price: "$3590",
  rating: 4.9,
  reviews: 128,
  features: [
    {
      icon: Zap,
      title: "UV-C Technology",
      description: "Powerful UV-C light eliminates 99.9% of bacteria"
    },
    {
      icon: Timer,
      title: "Quick Clean",
      description: "Complete sanitization in just 15 minutes"
    },
    {
      icon: ShieldCheck,
      title: "Safe & Chemical-free",
      description: "No harsh chemicals, perfect for all helmet types"
    },
    {
      icon: Sparkles,
      title: "Odor Elimination",
      description: "Advanced filtration removes unwanted odors"
    }
  ],
  specs: {
    dimensions: "12\" x 10\" x 8\"",
    weight: "2.5 lbs",
    power: "110-240V AC",
    warranty: "2 Years"
  }
};


// Types
interface Stat {
  value: string
  label: string
}

interface FooterSection {
  title: string
  links: string[]
}

interface ContactForm {
  name: string
  email: string
  message: string
}

// Animation variants
const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const scaleUp: Variants = {
  initial: { scale: 0.5 },
  animate: { 
    scale: 1,
    transition: {
      duration: 0.5
    }
  }
}

// Constants
const stats: Stat[] = [
  { value: "100+", label: "Locations" },
  { value: "50K+", label: "Helmets Cleaned" },
  { value: "99.9%", label: "Sanitization Rate" },
  { value: "4.9/5", label: "Customer Rating" },
]

const footerLinks: FooterSection[] = [
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

const contactInfo = [
  { icon: MapPin, text: "Find locations near you", href: "/locations" },
  { icon: Mail, text: "support@helmetpro.com", href: "mailto:support@helmetpro.com" },
  { icon: Phone, text: "(555) 123-4567", href: "tel:+15551234567" },
]

export default function Home() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Add your form submission logic here
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulated API call
      setFormData({ name: "", email: "", message: "" })
      alert("Message sent successfully!")
    } catch (error) {
      alert("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
            <TawkMessenger /> {/* Add this line right after the opening div */}
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
            variants={staggerChildren}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-12">
              Trusted by Thousands of Riders
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center"
                  variants={fadeInUp}
                >
                  <motion.div
                    className="text-4xl md:text-6xl font-bold mb-2"
                    initial="initial"
                    whileInView="animate"
                    variants={scaleUp}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-base md:text-lg font-medium text-white/90">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

      {/* Product Showcase Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            {/* Product Image */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="relative lg:w-full lg:h-[50rem] h-full aspect-square rounded-3xl overflow-hidden bg-blue-600/10 backdrop-blur-xl border border-blue-500/20">
                <Image
                  src="/helmetpro/ProductImage_1.png"
                  alt="HelmetPro UV Sanitizer"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent" />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:w-1/2"
            >
              <Badge className="mb-4 bg-blue-500/10 text-black border-blue-500/20 backdrop-blur-xl">
                New Release
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-black mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                {product.tagline}
              </p>
              <p className="text-gray-600 text-lg mb-8">
                {product.description}
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl font-bold text-black">{product.price}</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-white">{product.rating}</span>
                  <span className="text-gray-600">({product.reviews} reviews)</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="px-8 py-6 bg-blue-600 hover:bg-blue-700 text-lg">
                  Buy Now
                </Button>
                <Button variant="outline" className="px-8 py-6 border-blue-500/20 text-blue-300 hover:bg-blue-500/10 text-lg">
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl" />
        </div>
      </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Get in Touch
            </h2>
            <p className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
              We're here to help! Reach out to us for support or partnership inquiries.
            </p>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerChildren}
              >
                <div className="space-y-6">
                  {contactInfo.map(({ icon: Icon, text, href }) => (
                    <motion.a
                      key={text}
                      href={href}
                      className="flex items-center gap-4 text-lg justify-center lg:justify-start hover:text-blue-400 transition-colors"
                      variants={fadeInUp}
                    >
                      <Icon className="h-6 w-6 text-blue-400" />
                      <span>{text}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <textarea
                    placeholder="Message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>



    <footer className="bg-slate-900 text-slate-200 py-12">
      <motion.div 
        className="container max-w-screen-xl mx-auto px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <div className="grid md:grid-cols-4 gap-8">
          <motion.div variants={fadeInUp} className="space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/helmetpro/logo.jpeg"
                alt="HelmetPro Logo"
                width={80}
                height={80}
                className="h-14 w-auto rounded-lg shadow-md hover:shadow-lg transition-shadow"
                priority
              />
            </Link>
            <p className="text-slate-400">
              The future of helmet cleaning and maintenance.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="#" 
                className="text-slate-400 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded-full"
                aria-label="Messenger"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </motion.div>

          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={fadeInUp}>
              <h3 className="font-semibold mb-4 text-lg">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li 
                    key={link}
                    whileHover={{ x: 5 }}
                  >
                    <a 
                      href="#"
                      className="text-slate-400 hover:text-white transition-colors inline-block"
                    >
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
          <p className="text-sm">
            © {new Date().getFullYear()} HelmetPro. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
    </div>
  )
}