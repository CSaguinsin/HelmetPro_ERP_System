"use client";

import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Check, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck,
  Timer,
  Zap,
  Shield, 
  Smartphone, 
  RefreshCw 
} from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { ReactNode } from "react"


// Animation wrapper component
const FadeInView = ({ children, delay = 0 }: FadeInViewProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  )
}

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
}


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

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900">
      <SiteHeader />
      
      {/* Original Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-16 lg:py-32">
          <div className="mx-auto max-w-[800px] text-center">
            <Badge className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl">
              Our Products
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-4xl font-bold tracking-tight text-white lg:text-7xl"
            >
              Revolutionary
              <span className="block text-blue-200">Helmet Care Solutions</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-white/80 lg:text-xl"
            >
              Discover our innovative range of helmet cleaning and maintenance products designed for modern riders.
            </motion.p>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full text-gray-900"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,128L80,117.3C160,107,320,85,480,90.7C640,96,800,128,960,128C1120,128,1280,96,1360,80L1440,64L1440,160L1360,160C1280,160,1120,160,960,160C800,160,640,160,480,160C320,160,160,160,80,160L0,160Z"
            />
          </svg>
        </div>
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
              <Badge className="mb-4 bg-blue-500/10 text-blue-300 border-blue-500/20 backdrop-blur-xl">
                New Release
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
                {product.name}
              </h1>
              <p className="text-xl text-blue-300 mb-6">
                {product.tagline}
              </p>
              <p className="text-gray-300 text-lg mb-8">
                {product.description}
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                <span className="text-4xl font-bold text-white">{product.price}</span>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="text-white">{product.rating}</span>
                  <span className="text-gray-400">({product.reviews} reviews)</span>
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

      {/* Features Section */}
      <section className="py-24 relative bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-black mb-6">
              Advanced Features
            </h2>
            <p className="text-xl text-black max-w-2xl mx-auto">
              Experience the perfect blend of technology and convenience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {product.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-white border-blue-500/20 backdrop-blur-xl">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <feature.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-black mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specifications Section */}
      {/* Specifications Section */}
      <section className="py-24 relative bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-400">
              Engineered for reliability, efficiency, and user convenience.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Specification Cards */}
            {[
              { icon: Shield, title: "Helmet Cleaning Vending Machine", desc: "Automated helmet cleaning and sanitization for public use." },
              { icon: Smartphone, title: "Advertising Sticker Area", desc: "Customize with brand or promotional stickers for better visibility." },
              { icon: RefreshCw, title: "Weight: 105kg", desc: "Built with sturdy materials, ensuring stability during operation." },
              { icon: ArrowRight, title: "Height: 1720mm", desc: "Optimal user interaction with a towering 1720mm height." },
              { icon: ArrowRight, title: "Width: 560mm", desc: "Compact yet functional design with a width of 560mm." },
              { icon: ArrowRight, title: "Length: 560mm", desc: "Streamlined for seamless space integration." },
              { icon: Smartphone, title: "HD Touch All-In-One", desc: "Features an HD touch display for smooth, intuitive interaction." },
              { icon: Zap, title: "Breathe Ambient Lighting", desc: "Elegant ambient lighting for enhanced user comfort." },
              { icon: CheckCircle, title: "Helmet Washing Area", desc: "Dedicated washing area for convenience and hygiene." },
              { icon: Timer, title: "Coin Ware", desc: "Equipped with a coin ware for easy, cash-based transactions." }
            ].map((spec, index) => (
              <motion.div
                key={spec.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 bg-gray-800 border-gray-700/50 rounded-lg shadow-md flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <spec.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{spec.title}</h3>
                    <p className="text-gray-400">{spec.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <FadeInView>
        <section className="relative overflow-hidden bg-blue-600 py-16 lg:py-24">
          <div className="container relative mx-auto px-4 max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Ready to Experience the Future of Helmet Care?
              </h2>
              <p className="mt-6 text-lg text-blue-100">
                Join thousands of satisfied users who trust HelmetPro for their helmet maintenance needs.
              </p>
              <div className="mt-10 flex justify-center gap-x-6">
                <Button className="rounded-full bg-white px-8 py-6 text-lg font-semibold text-blue-600 hover:bg-blue-50">
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInView>

      {/* Original Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300 border-t border-blue-500/20">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-4">
          <div>
            <Image
              src="/helmetpro/logo.jpeg"
              alt="HelmetPro Logo"
              width={80}
              height={80}
              className="mb-4 rounded-lg"
            />
            <p className="text-sm">The future of helmet cleaning and maintenance.</p>
            <div className="mt-4 flex space-x-4">
              <Facebook className="h-5 w-5 cursor-pointer text-gray-400 hover:text-white" />
              <Instagram className="h-5 w-5 cursor-pointer text-gray-400 hover:text-white" />
              <MessageCircle className="h-5 w-5 cursor-pointer text-gray-400 hover:text-white" />
            </div>
          </div>
          {['Company', 'Product', 'Resources'].map((section) => (
            <div key={section}>
              <h3 className="mb-4 font-semibold">{section}</h3>
              <ul className="space-y-2">
                {['About', 'Features', 'Documentation', 'Support'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}