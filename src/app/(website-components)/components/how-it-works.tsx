import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const staggerChildren = {
  animate: {
    transition: { staggerChildren: 0.1 }
  }
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <motion.div 
        className="container flex-1 max-w-screen-xl mx-auto px-4"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerChildren}
      >
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-3xl font-bold mb-4">Clean Your Helmet in Three Simple Steps</h2>
          <p className="text-muted-foreground">
            Our smart stations use advanced technology to provide thorough cleaning and sanitization in minutes, keeping
            you safe on every ride.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-lg"
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-xl font-bold text-blue-500">{index + 1}</span>
              </motion.div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {index < steps.length - 1 && (
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-blue-500" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

const steps = [
  {
    title: "Locate & Scan",
    description: "Find the nearest station and scan your helmet's QR code for personalized cleaning.",
  },
  {
    title: "Place & Select",
    description: "Place your helmet in the smart chamber and choose your preferred cleaning program.",
  },
  {
    title: "Wait & Collect",
    description: "Our AI-powered system thoroughly cleans your helmet in just 15 minutes.",
  },
]