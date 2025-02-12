"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../components/site-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen, BarChart, Package, Clock, Shield } from "lucide-react";
import { Facebook, Instagram, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RevenueCalculator from "@/app/components/RevenueCalculator";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1 },
  },
};

export default function JoinUs() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-blue-900">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-16 lg:py-32">
          <div className="mx-auto max-w-[800px] text-center">
            <Badge className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl">
              Partnership Opportunities
            </Badge>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-4xl font-bold tracking-tight text-white lg:text-7xl"
            >
              Join the Future of
              <span className="block text-blue-200">Helmet Care Business</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-white/80 lg:text-xl"
            >
              Partner with HelmetPro and bring our revolutionary helmet cleaning technology to your area.
            </motion.p>
          </div>
        </div>

        {/* Wave Effect */}
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

      {/* Why Join Us Section */}
      <section id="partnership-benefits" className="py-24">
        <motion.div
          className="container mx-auto max-w-6xl px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-3xl md:text-4xl text-white font-bold text-center mb-16" variants={fadeInUp}>
            Why Partner With Us?
          </motion.h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl bg-gray-800 border border-blue-500/20 shadow-lg transition hover:shadow-2xl"
                variants={fadeInUp}
              >
                <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <benefit.icon className="h-8 w-8 text-blue-300" />
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Investment & Returns Section */}
      <section className="py-24 bg-gray-800">
        <motion.div
          className="container mx-auto max-w-6xl px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-3xl md:text-4xl text-white font-bold text-center mb-16" variants={fadeInUp}>
            Investment & Returns
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div className="space-y-6" variants={fadeInUp}>
              <h3 className="text-2xl text-white font-semibold">High-Return Business Model</h3>
              <p className="text-gray-300">
                Our automated vending model provides excellent revenue potential with minimal operational overhead.
              </p>
              <ul className="space-y-4">
                {investmentPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Image
                src="/helmetpro/innovativeImage.png"
                alt="Investment Returns"
                width={600}
                height={400}
                className="rounded-xl shadow-lg"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Potential Income Computation Section */}
      <section className="py-24">
        <motion.div
          className="container mx-auto max-w-6xl px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-3xl md:text-4xl text-white font-bold text-center mb-8" variants={fadeInUp}>
            Potential Income Computation
          </motion.h2>
          <motion.p className="text-gray-300 text-center mb-12 max-w-4xl mx-auto" variants={fadeInUp}>
            With our HelmetPro vending machines, you can tap into a lucrative market that is rapidly growing and evolving. These innovative machines not only provide a convenient solution for helmet cleaning but also present an exciting opportunity for entrepreneurs and business owners looking to diversify their income streams. Here iss a comprehensive breakdown of potential earnings based on various utilization assumptions. By analyzing different scenarios—such as operating hours, customer demand, and pricing strategies—you can gain valuable insights into how our vending machines can maximize your profitability.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex justify-center mb-16">
            <Button asChild className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <Link href="/partnership">
                Partner with us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          {/* Utilization Scenarios Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-800 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Assumption 1: 90-100% Utilization</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-4">If your machine is running (10 hours/day) throughout the day, servicing about 40 helmets daily:</p>
                  <ul className="space-y-2">
                    <li>Average Price Per Wash: ₱100</li>
                    <li>Daily Income: ₱4,000 (₱100 x 40 helmets)</li>
                    <li>Weekly Income: ₱28,000 (₱4,000 x 7 days)</li>
                    <li>Monthly Income: ₱120,400 (₱28,000 x 4.3 weeks)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-800 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Assumption 2: 50% Utilization</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-4">If your machine is running at half capacity, cleaning approximately 20 helmets daily:</p>
                  <ul className="space-y-2">
                    <li>Average Price Per Wash: ₱100</li>
                    <li>Daily Income: ₱2,000 (₱100 x 20 helmets)</li>
                    <li>Weekly Income: ₱14,000 (₱2,000 x 7 days)</li>
                    <li>Monthly Income: ₱60,200 (₱14,000 x 4.3 weeks)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="bg-gray-800 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Assumption 3: 25% Utilization</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300">
                  <p className="mb-4">If your machine is running at 25% capacity, cleaning around 10 helmets per day:</p>
                  <ul className="space-y-2">
                    <li>Average Price Per Wash: ₱100</li>
                    <li>Daily Income: ₱1,000 (₱100 x 10 helmets)</li>
                    <li>Weekly Income: ₱7,000 (₱1,000 x 7 days)</li>
                    <li>Monthly Income: ₱30,100 (₱7,000 x 4.3 weeks)</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Revenue Calculator Section */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-2xl md:text-3xl text-white font-bold mb-8">
              Discover Your Profit Potential with the HelmetPro Revenue & Cost Calculator
            </h2>
            <RevenueCalculator />
          </motion.div>

          {/* Market Statistics Section */}
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl text-white font-bold mb-8">Motorcycle Usage in the Philippines</h2>
              <p className="text-4xl font-bold text-blue-400 mb-4">8,470,000</p>
              <p className="text-gray-300">registered motorcycles in the Philippines as of 2024</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-8 rounded-xl border border-blue-500/20">
                <h3 className="text-xl text-white font-semibold mb-4">Safety Commitment</h3>
                <p className="text-gray-300">
                  Most riders are dedicated to safety, proudly donning helmets on every journey. However, many face the challenge of maintaining helmet hygiene and combating unpleasant odors.
                </p>
              </div>

              <div className="bg-gray-800 p-8 rounded-xl border border-blue-500/20">
                <h3 className="text-xl text-white font-semibold mb-4">The Challenge</h3>
                <p className="text-gray-300">
                  Helmets can accumulate dirt, sweat, and odor over time, making it essential for riders to have a reliable cleaning solution. This is where HelmetPro comes in.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-700 to-cyan-500 text-white text-center">
        <motion.div
          className="container mx-auto max-w-4xl px-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" variants={fadeInUp}>
            Ready to Get Started?
          </motion.h2>
          <motion.p className="text-lg md:text-xl mb-8 text-blue-100" variants={fadeInUp}>
            Join our network of successful partners and bring HelmetPro to your community.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button asChild className="bg-white text-blue-600 hover:bg-blue-200 text-lg px-8 py-4"
              onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSc_isim53g1u6-pYQRLzhk75UUQjFSYdkI9_wYUrgZCABmH8A/viewform", "_blank")}
            >
              <Link href="#">
                Apply for Partnership
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>


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

const benefits = [
  { icon: BookOpen, title: "Comprehensive Training", description: "Full training covering operations & business management." },
  { icon: BarChart, title: "Marketing Support", description: "Access to high-quality marketing materials." },
  { icon: Package, title: "Exclusive Products", description: "Utilize our proprietary cleaning technology." },
  { icon: Clock, title: "Flexible Hours", description: "Automated system allows easy management." },
];

const investmentPoints = [
  "Low investment with quick returns",
  "Automated revenue model",
  "Site selection support",
  "Ongoing technical assistance",
  "Strong brand presence",
];
