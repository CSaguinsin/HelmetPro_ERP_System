import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" },
}

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.2 },
  },
}

export function HeroSection() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-white">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm"
          src="/video/demo.mp4"
          autoPlay
          loop
          muted
          playsInline
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-gray-900/30" />
      </div>

      <motion.div
        className="relative container mx-auto max-w-5xl px-6 text-center"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Badge */}
        <motion.div variants={fadeInUp}>
          <Badge className="mx-auto bg-blue-600 text-white shadow-lg text-lg px-4 py-2">
            🚀 Now Available in 100+ Locations
          </Badge>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mt-6"
          variants={fadeInUp}
        >
          The Future of{" "}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Helmet Cleaning
          </span>
          {" "}is Here
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mt-4 leading-relaxed"
          variants={fadeInUp}
        >
          AI-powered stations delivering **99.9% sanitization** in just **15 minutes**. Stay safe, ride clean.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mt-8"
          variants={fadeInUp}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              className="text-xl font-semibold px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md transition-all hover:scale-105"
            >
              Find Nearest Station
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              variant="outline"
              className="text-xl font-semibold px-8 py-4 text-black border-gray-500 hover:border-white"
            >
              Watch How It Works
            </Button>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mt-10"
          variants={staggerContainer}
        >
          {["99.9% Sanitization", "15-Min Clean", "AI-Powered Detection"].map((feature) => (
            <motion.div
              key={feature}
              className="flex items-center gap-3 text-gray-300 text-lg font-medium"
              variants={fadeInUp}
              whileHover={{ x: 5 }}
            >
              <CheckCircle className="h-6 w-6 text-blue-400" />
              <span>{feature}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
