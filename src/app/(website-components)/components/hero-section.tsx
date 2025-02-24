"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.15 },
  },
}

export function HeroSection() {
  const router = useRouter()
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-slate-900 to-black text-white min-h-screen flex items-center">
      {/* Modern Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-violet-500/20 via-transparent to-transparent"
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 10, ease: "linear" }}
        />
      </div>

      <motion.div
        className="relative container mx-auto max-w-7xl px-6 py-20 z-10"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div className="space-y-8" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <Badge className="w-fit px-3 py-1 text-sm bg-violet-600 text-white shadow-lg rounded-full">
                <Zap className="w-4 h-4 mr-1 inline" />
                Next-Gen Helmet Tech
              </Badge>
            </motion.div>

            <motion.h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight" variants={fadeInUp}>
              Smart Helmet Cleaning for the{" "}
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                Modern Rider
              </span>
            </motion.h1>

            <motion.p className="text-lg text-gray-300 max-w-xl" variants={fadeInUp}>
              Experience the future of helmet maintenance with Advanced UV-C sanitization technology. Get a 99.9%
              sanitized helmet in 15 minutes.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div className="flex flex-col sm:flex-row gap-4" variants={fadeInUp}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-violet-500 to-cyan-500 text-white shadow-lg transition-all hover:shadow-violet-500/50 hover:-translate-y-1"
                onClick={() =>
                  window.open(
                    "https://docs.google.com/forms/d/e/1FAIpQLSc_isim53g1u6-pYQRLzhk75UUQjFSYdkI9_wYUrgZCABmH8A/viewform",
                    "_blank",
                  )
                }
              >
                Partner With Us Today!
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-black border-violet-400 hover:bg-violet-white"
                onClick={() => router.push("/about")}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Features */}
            <motion.div className="grid grid-cols-2 sm:grid-cols-3 gap-4" variants={staggerContainer}>
              {[
                "99.9% Sanitization",
                "15-Min Clean",
                "Smart Detection",
                "Eco-Friendly",
                "Mobile App Control",
                "24/7 Support",
              ].map((feature) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2 text-gray-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.05, color: "#fff" }}
                >
                  <CheckCircle className="h-5 w-5 text-violet-400" />
                  <span className="text-sm font-medium">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Video Section */}
          <motion.div
            className="relative w-full max-w-lg mx-auto lg:mx-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Video Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 rounded-3xl blur-lg" />

            <motion.div
              className="relative overflow-hidden rounded-3xl shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <video
                src="/video/demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto max-h-[600px] rounded-3xl object-cover"
              />
            </motion.div>

            {/* Sanitizing Progress Overlay */}
            <motion.div
              className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-400">Sanitizing in progress</span>
                </div>
                <span className="text-2xl font-bold text-violet-400">87%</span>
              </div>
              <div className="h-2 bg-violet-900/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
                  initial={{ width: "0%" }}
                  animate={{ width: "87%" }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                ></motion.div>
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                <span>99.9% Effective</span>
                <span>Eco-friendly</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

      </motion.div>
    </div>
  )
}

