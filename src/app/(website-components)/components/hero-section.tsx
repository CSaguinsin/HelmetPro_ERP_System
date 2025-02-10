import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

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
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-black to-gray-900 text-white pb-20">
      {/* Subtle Animated Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-blue-700/30 via-black/50 to-gray-900/50"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
      />

      <motion.div
        className="relative container mx-auto max-w-7xl px-6 pt-20 lg:pt-32 text-center lg:text-left"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div className="space-y-6" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <Badge className="w-fit mx-auto lg:mx-0 bg-blue-600 text-white shadow-lg">
                🚀 Now serving 100+ locations
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
              variants={fadeInUp}
            >
              Smart Helmet Cleaning for the{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Modern Rider
              </span>
            </motion.h1>

            <motion.p
              className="text-lg text-gray-300 max-w-xl mx-auto lg:mx-0"
              variants={fadeInUp}
            >
              Experience the future of helmet maintenance with AI-powered cleaning stations. Get a **99.9% sanitized helmet in 15 minutes.**
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              variants={fadeInUp}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md transition-all hover:scale-105"
                >
                  Find Nearest Station
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" variant="outline" className="text-black border-gray-600 hover:border-white">
                  Watch How It Works
                </Button>
              </motion.div>
            </motion.div>

            {/* Features */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4"
              variants={staggerContainer}
            >
              {["99.9% Sanitization", "15-Min Clean", "Smart Detection"].map((feature) => (
                <motion.div
                  key={feature}
                  className="flex items-center gap-2 text-gray-300"
                  variants={fadeInUp}
                  whileHover={{ x: 5 }}
                >
                  <CheckCircle className="h-5 w-5 text-blue-400" />
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
            <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-3xl blur-lg" />

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
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
