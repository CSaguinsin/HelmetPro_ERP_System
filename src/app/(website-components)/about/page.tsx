"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {  Zap, Sparkles, CheckCircle, ArrowRight } from "lucide-react"
import { SiteHeader } from "../components/site-header"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { ReactNode, useRef } from "react"
import { useRouter } from 'next/navigation'
import Footer from "../components/footer";

interface FadeInViewProps {
  children: ReactNode;
  delay?: number;
}


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



export default function AboutUs() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-10 lg:pt-0">
      <SiteHeader />
      
      {/* Hero Section with Gradient Background */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500"
      >
        {/* Hero content remains the same */}
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-16 lg:py-32">
          <div className="mx-auto max-w-[800px] text-center">
            <Badge className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-white backdrop-blur-xl">
              About HelmetPro
            </Badge>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 text-4xl font-bold tracking-tight text-white lg:text-7xl"
            >
              Making Helmet Safety
              <span className="block text-blue-200">Simple & Accessible</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-6 text-lg leading-8 text-white/80 lg:text-xl lg:max-w-3xl mx-auto"
            >
              Revolutionizing helmet hygiene with smart technology and sustainable solutions. 
              We are making clean, safe helmets accessible to everyone, everywhere.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-10 flex items-center justify-center gap-x-6"
            >
              <Button className="rounded-full bg-white px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg font-semibold text-blue-600 hover:bg-blue-50"
               onClick={() => router.push('/products')}
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Curved Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full text-gray-50 dark:text-gray-900"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              d="M0,128L80,117.3C160,107,320,85,480,90.7C640,96,800,128,960,128C1120,128,1280,96,1360,80L1440,64L1440,160L1360,160C1280,160,1120,160,960,160C800,160,640,160,480,160C320,160,160,160,80,160L0,160Z"
            />
          </svg>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 max-w-6xl mx-auto">
            {[
              { label: "Active Users", value: "50K+" },
              { label: "Cities", value: "100+" },
              { label: "Helmets Cleaned", value: "1M+" },
              { label: "Satisfaction Rate", value: "99.9%" },
            ].map((stat, index) => (
              <FadeInView key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-2xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm lg:text-base text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 lg:py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-6xl">
          <FadeInView>
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold lg:text-5xl">
                Why Choose <span className="text-blue-600">HelmetPro</span>
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-400 lg:text-lg">
                Our innovative approach to helmet care sets new standards in the industry
              </p>
            </div>
          </FadeInView>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <FadeInView key={index} delay={index * 0.2}>
                <Card className="p-6 lg:p-8 transition-all hover:shadow-lg dark:bg-gray-800">
                  <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    <feature.icon className="h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                  <h3 className="mb-2 text-xl lg:text-2xl font-semibold">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 lg:text-lg">{feature.description}</p>
                </Card>
              </FadeInView>
            ))}
          </div>
        </div>
      </section>

      {/* Zig-Zag Content Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-24">
            {features.map((feature, index) => (
              <FadeInView key={index}>
                <div className={`grid md:grid-cols-2 items-center gap-8 lg:gap-16`}>
                  {index % 2 === 0 ? (
                    <>
                      <div className="space-y-6">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                        <Button className="rounded-full bg-white px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg font-semibold text-blue-600 hover:bg-blue-50"
               onClick={() => router.push('/products')}
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
                      </div>
                      <div className="relative aspect-square w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl">
                        <Image 
                          src={`/about/aboutImage_${index + 2}.png`}
                          alt={feature.title}
                          fill
                          className="object-cover transform transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative aspect-square w-full max-w-xl mx-auto rounded-2xl overflow-hidden shadow-xl order-2 md:order-1">
                        <Image 
                          src={`/about/aboutImage_${index + 2}.png`}
                          alt={feature.title}
                          fill
                          className="object-cover transform transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-6 order-1 md:order-2">
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
                        <Button className="rounded-full bg-white px-6 py-5 text-base lg:px-8 lg:py-6 lg:text-lg font-semibold text-blue-600 hover:bg-blue-50"
               onClick={() => router.push('/products')}
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
                      </div>
                    </>
                  )}
                </div>
              </FadeInView>
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
                <Button className="rounded-full bg-white px-8 py-6 text-lg font-semibold text-blue-600 hover:bg-blue-50"
                 onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSc_isim53g1u6-pYQRLzhk75UUQjFSYdkI9_wYUrgZCABmH8A/viewform", "_blank")}
                >
                  Get Started Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </FadeInView>

      {/* Footer */}
        <Footer />
    </div>
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

