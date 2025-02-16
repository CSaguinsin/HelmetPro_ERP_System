"use client";

import { SiteHeader } from "../app/(website-components)/components/site-header";
import { HeroSection } from "../app/(website-components)/components/hero-section";
import { HowItWorks } from "../app/(website-components)/components/how-it-works";
import Footer from "../app/(website-components)/components/footer";
import { motion } from "framer-motion";
import { TawkMessenger } from "./components/TawkMessenger";


const stats = [
  { value: "100+", label: "Locations" },
  { value: "50K+", label: "Helmets Cleaned" },
  { value: "99.9%", label: "Sanitization Rate" },
  { value: "4.9/5", label: "Customer Rating" }
];



export default function Home() {
  return (
    <div className="flex min-h-screen flex-col pt-10 lg:pt-0">
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
        {/* <ContactSection /> */}
      </main>

        <Footer />
    </div>
  );
}
