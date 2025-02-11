"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Users, Target, Zap } from "lucide-react"
import { SiteHeader } from "../components/site-header"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.2 },
  },
}

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}


export default function AboutUs() {
  return (
    <section id="about" className="relative bg-white text-gray-900">
      <SiteHeader />
      {/* Hero Section */}
      <motion.div
        className="container mx-auto max-w-7xl px-6 py-32 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Badge className="text-lg px-4 py-2 bg-blue-600 text-white shadow-lg">About Us</Badge>
        </motion.div>
        <motion.h2
          className="text-6xl font-extrabold tracking-tight mt-6 leading-tight"
          variants={fadeInUp}
        >
          Empowering Riders with{" "}
          <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Smart Helmet Solutions
          </span>
        </motion.h2>
        <motion.p className="text-xl text-gray-600 max-w-3xl mx-auto mt-4" variants={fadeInUp}>
          Our mission is simple—**make helmet hygiene effortless and advanced**.  
          Through **AI-powered sanitization**, we bring **cleaner, safer rides to thousands of riders worldwide**.
        </motion.p>
      </motion.div>

      {/* Image & Story Section */}
      <motion.div
        className="container mx-auto max-w-7xl px-6 py-32 grid md:grid-cols-2 gap-16 items-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        {/* Left Content */}
        <motion.div className="space-y-6" variants={fadeInUp}>
          <h3 className="text-4xl font-bold leading-tight">
            A Vision for <span className="text-blue-600">Safety & Technology</span>
          </h3>
          <p className="text-lg text-gray-600 leading-relaxed">
            At HelmetPro, we’re leading a **new era in helmet care**.  
            Our AI-powered **sanitization stations** are designed to provide **99.9% germ-free** helmets in minutes.  
            We’re not just a company—we’re a movement towards **smarter, safer riding**.
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:scale-105 transition">
            Explore Our Technology
          </Button>
        </motion.div>

        {/* Right Image */}
        <motion.div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl" variants={fadeInUp}>
          <Image src="/about-us.jpg" alt="Our Team" fill className="object-cover" />
        </motion.div>
      </motion.div>

      {/* Core Values Section */}
      <motion.div
        className="container mx-auto max-w-6xl px-6 py-32 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h3 className="text-4xl font-bold mb-16" variants={fadeInUp}>
          Our Core Values
        </motion.h3>
        <div className="grid md:grid-cols-3 gap-12">
          {values.map((value) => (
            <motion.div key={value.title} className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 rounded-xl bg-blue-600/20 flex items-center justify-center mx-auto mb-6">
                <value.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-2xl font-semibold">{value.title}</h4>
              <p className="text-lg text-gray-600 mt-2">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Leadership Section */}
      <motion.div
        className="container mx-auto max-w-7xl px-6 py-32 text-center"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
      >
        <motion.h3 className="text-4xl font-bold mb-16" variants={fadeInUp}>
          Meet the Team Behind HelmetPro
        </motion.h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {team.map((member) => (
            <motion.div key={member.name} className="text-center space-y-4" variants={fadeInUp}>
              <div className="relative w-40 h-40 mx-auto">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover rounded-full border-4 border-gray-300 shadow-lg"
                />
              </div>
              <h4 className="text-xl font-semibold">{member.name}</h4>
              <p className="text-lg text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
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
    </section>
  )
}

const values = [
  {
    icon: Users,
    title: "User-Centric",
    description: "Our riders' experience drives every decision we make.",
  },
  {
    icon: Target,
    title: "Tech-Driven",
    description: "We push innovation with AI-powered helmet sanitization.",
  },
  {
    icon: Zap,
    title: "Sustainability",
    description: "Eco-friendly, water-efficient, and chemical-free cleaning.",
  },
]

const team = [
  {
    name: "Alex Johnson",
    role: "CEO & Co-founder",
    image: "/team/alex.jpg",
  },
  {
    name: "Sarah Lee",
    role: "CTO",
    image: "/team/sarah.jpg",
  },
  {
    name: "Michael Chen",
    role: "Head of Operations",
    image: "/team/michael.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Chief Marketing Officer",
    image: "/team/emily.jpg",
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