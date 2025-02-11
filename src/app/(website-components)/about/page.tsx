"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Users, Target, Zap, Sparkles, CheckCircle } from "lucide-react"
import { SiteHeader } from "../components/site-header"
import Link from "next/link"

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
}

const fadeIn = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.2 } },
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
    <section className="relative bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br  from-blue-600 via-cyan-500 to-blue-400 text-white py-12 md:py-24">
        <motion.div
          className="container mx-auto max-w-6xl text-center px-4 md:px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge className="text-base md:text-lg px-3 md:px-4 py-1.5 md:py-2 bg-white/20 text-white shadow-md backdrop-blur-md">
              About Us
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mt-6 leading-tight"
            variants={fadeInUp}
          >
            Revolutionizing{" "}
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Helmet Hygiene
            </span>
          </motion.h1>

          <motion.p className="text-base md:text-xl text-white/80 max-w-3xl mx-auto mt-4" variants={fadeInUp}>
            AI-powered helmet sanitization for <strong>safer, cleaner rides</strong>—guaranteed{" "}
            <strong>99.9% germ-free</strong> in minutes.
          </motion.p>

          <motion.div className="mt-8 flex flex-col sm:flex-row justify-center gap-4" variants={fadeInUp}>
            <Link href="/technology" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-white text-blue-600 px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-gray-200 transition">
                Explore Technology
              </Button>
            </Link>
            <Link href="/contact" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto border-2 border-white text-white px-6 py-3 rounded-full font-semibold text-lg hover:bg-white/20 transition">
                Contact Us
              </Button>
            </Link>
          </motion.div>

          <motion.div
            className="relative w-full max-w-4xl mx-auto mt-12 rounded-3xl shadow-2xl overflow-hidden"
            variants={fadeInUp}
          >
            <video
              src="/video/comparisionvideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto max-h-[600px] object-cover rounded-3xl"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Our Mission Section */}
      <motion.div
        className="container mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-32"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-bold">
              Our <span className="text-blue-600 dark:text-blue-400">Mission</span>
            </h3>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              At <strong>HelmetPro</strong>, we are redefining helmet hygiene and revolutionizing rider safety. Our Helmet Cleaning Vending Machines offer a seamless, on-the-go solution for ensuring every ride is cleaner and safer.
              <br /><br />
              No more worrying about germ-infested, sweat-soaked helmets—our state-of-the-art sanitization technology eliminates bacteria efficiently, delivering a fresh, hygienic helmet in seconds.
              <br /><br />
              Whether you're a daily commuter or a weekend adventurer, our smart dispensers provide instant access to professionally cleaned helmets—without the hassle of ownership.
            </p>
            <Button className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-lg shadow-lg hover:bg-blue-700 transition">
              Learn More
            </Button>
          </div>
          <motion.div className="relative aspect-square w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg" variants={fadeIn}>
            <Image src="/about/aboutImage_1.png" alt="Our Mission" fill className="object-cover" />
          </motion.div>
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div
        className="container mx-auto max-w-7xl px-4 md:px-6 py-16 md:py-32"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeIn}
      >
        <h3 className="text-3xl md:text-4xl font-bold text-center mb-5">
          Why Choose <span className="text-blue-600 dark:text-blue-400">HelmetPro?</span>
        </h3>
        <p className="text-center mb-10 max-w-3xl mx-auto text-base md:text-lg text-gray-600 dark:text-gray-300">
          At the core of our company is a vision to lead the industry through innovation, quality, and sustainability. We believe that every product we create should reflect our commitment to excellence and our desire to contribute positively to our community and the environment.
        </p>

        <motion.div 
          className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="p-6 md:p-8 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <feature.icon className="h-10 w-10 md:h-12 md:w-12 text-blue-600 dark:text-blue-400 mb-6" />
              <h3 className="text-lg md:text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="space-y-16 md:space-y-24">
          {/* Feature sections */}
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              className={`grid md:grid-cols-2 items-center gap-8 md:gap-12`}
              variants={fadeIn}
            >
              {index % 2 === 0 ? (
                <>
                  <div className="space-y-6">
                    <h4 className="text-2xl md:text-3xl font-semibold">{feature.title}</h4>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                  <div className="relative aspect-square w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg">
                    <Image 
                      src={`/about/aboutImage_${index + 2}.png`}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="relative aspect-square w-full max-w-xl mx-auto rounded-xl overflow-hidden shadow-lg order-2 md:order-1">
                    <Image 
                      src={`/about/aboutImage_${index + 2}.png`}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="space-y-6 order-1 md:order-2">
                    <h4 className="text-2xl md:text-3xl font-semibold">{feature.title}</h4>
                    <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Revolutionize Your Helmet Care?</h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied riders who trust HelmetPro for their helmet cleaning and maintenance needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-blue-50">
                Get Started
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-black border-white hover:bg-white/10">
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-slate-900 text-slate-200 py-12">
        <motion.div 
          className="container max-w-screen-xl mx-auto px-4 md:px-6"
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
                    className="h-14 w-auto rounded-lg shadow-md"
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

const features = [
  {
    icon: CheckCircle,
    title: "Advanced UV-C Sanitization Technology",
    description: "Experience next-level cleanliness with our advanced UV-C sanitization technology, eliminating 99.9% of bacteria and odors in minutes. Our chemical-free cleaning process ensures your helmet is fresh and safe for every ride.",
  },
  {
    icon: Sparkles,
    title: "Eco-Friendly & Sustainable",
    description: "Our innovative technology reduces waste and promotes helmet reuse while minimizing environmental impact. We're committed to extending helmet life through advanced cleaning and sanitization, making riding both safer and more sustainable.",
  },
  {
    icon: Zap,
    title: "Effortless & Fast",
    description: "Access freshly sanitized helmets in seconds with our smart dispensers. Our streamlined process eliminates waiting and complications, so you can focus on what matters most—enjoying your ride.",
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