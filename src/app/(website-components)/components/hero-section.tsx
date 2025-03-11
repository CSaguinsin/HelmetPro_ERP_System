"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle, Zap, X, ChevronRight, ShieldCheck, Clock, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"


// Add these animation variants at the top of the file
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

// Simple utility for formatting numbers
// const formatNumber = (num: number, decimals = 0) => {
//   return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
// };

// Calendly component with loading state
const Calendly = ({ url }: { url: string }) => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="relative min-h-[700px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-violet-600 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="calendly-inline-widget" data-url={url} style={{ minWidth: "320px", height: "700px" }}></div>
    </div>
  );
};

export function HeroSection() {
  const router = useRouter();
  const [showCalendly, setShowCalendly] = useState(false);
  const videoRef = useRef(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isIntersecting, setIsIntersecting] = useState(false);
  
  // Handle calendly modal
  const toggleCalendly = () => {
    setShowCalendly(!showCalendly);
    document.body.style.overflow = !showCalendly ? 'hidden' : '';
  };

  // Progress animation
  useEffect(() => {
    if (isIntersecting) {
      const timer = setTimeout(() => {
        setProgressPercent(prevProgress => {
          if (prevProgress >= 87) return 87;
          return prevProgress + 1;
        });
      }, 30);
      
      return () => clearTimeout(timer);
    }
  }, [progressPercent, isIntersecting]);

  // Intersection observer for animations
  useEffect(() => {
    const currentVideoRef = videoRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (currentVideoRef) {
      observer.observe(currentVideoRef);
    }
    
    return () => {
      if (currentVideoRef) {
        observer.unobserve(currentVideoRef);
      }
    };
  }, []);
  
  return (
    <>
      <div className="relative bg-slate-950 overflow-hidden">
        {/* Ambient Background */}
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-radial from-violet-900/20 to-transparent opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-violet-600/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <header className="absolute top-0 left-0 w-full z-10 py-6">
            <div className="flex items-center justify-between">
              <div className="text-white font-bold text-xl">HelmetPro</div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" className="text-white hover:bg-white/10">Features</Button>
                <Button variant="ghost" className="text-white hover:bg-white/10">Pricing</Button>
                <Button variant="ghost" className="text-white hover:bg-white/10">About</Button>
                <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">Login</Button>
              </div>
            </div>
          </header>
                    
          <motion.div 
            className="py-32 flex flex-col items-center text-center relative z-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <Badge className="mb-4 py-1.5 px-3 bg-violet-600/90 text-white border-none">
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                UV-C Sanitization Technology
              </Badge>
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-4xl mb-6">
              The Smart Way to Keep Your 
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent block mt-2">
                Helmet Fresh & Clean
              </span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-300 max-w-2xl mb-8">
              Advanced sanitization that eliminates 99.9% of bacteria and odor in just 8 minutes.
              Designed for professional athletes and everyday riders.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-16">
              <Button 
                size="lg" 
                onClick={toggleCalendly}
                className="bg-cyan-700 text-white  transition-all"
              >
                Partner With Us
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-black border-white/20 "
                onClick={() => router.push("/about")}
              >
                Learn More
              </Button>
            </motion.div>
            
            {/* Statistics Cards */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 w-full max-w-3xl"
              variants={containerVariants}
            >
              {[
                { icon: ShieldCheck, value: "99.9%", label: "Sanitization Rate", color: "bg-violet-500" },
                { icon: Clock, value: "8", label: "Minutes Per Cycle", color: "bg-purple-500" },
                { icon: Sparkles, value: "24/7", label: "Customer Support", color: "bg-cyan-500" }
              ].map((stat, index) => (
                <div 
                  key={index} 
                  className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 p-6 group hover:bg-white/10 transition-all"
                >
                  <div className={`absolute -right-4 -top-4 w-16 h-16 ${stat.color} opacity-20 rounded-full blur-xl group-hover:opacity-30 transition-opacity`}></div>
                  <div className="flex flex-col items-center">
                    <stat.icon className="h-8 w-8 text-white mb-4" />
                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-gray-400 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
        
        {/* Product Showcase Section */}
        <div className="relative bg-gradient-to-b from-slate-950 to-slate-900 py-20 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative order-2 md:order-1">
                <motion.div 
                  className="relative z-10 bg-gradient-to-br from-slate-900 to-slate-950 p-1.5 rounded-3xl overflow-hidden border border-white/10 shadow-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div ref={videoRef} className="relative rounded-2xl overflow-hidden h-[600px]">
                    <video
                      src="/video/demo.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Status Overlay */}
                    <div className="absolute left-4 right-4 bottom-4 bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-white/10">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-sm font-medium text-green-400">Active Sanitization</span>
                        </div>
                        <span className="text-2xl font-bold text-white">{progressPercent}%</span>
                      </div>
                      
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                        <div 
                          className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Time Remaining: 1:03</span>
                        <span>UV-C Active</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating Indicators */}
                <div className="absolute -top-6 -left-6 bg-violet-600/90 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                  Smart Sensors
                </div>
                <div className="absolute -bottom-4 -right-4 bg-cyan-600/90 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-lg">
                  Medical-Grade UV-C
                </div>
              </div>
              
              <div className="order-1 md:order-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Advanced Technology <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">For Superior Results</span>
                </h2>
                
                <p className="text-gray-300 mb-8">
                  Our patented UV-C technology targets bacteria, fungi, and viruses that cause odor and skin 
                  irritation. The smart detection system maps your helmet in 3D to ensure complete coverage.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    "Medical-grade UV-C sanitization",
                    "Smart helmet detection and mapping",
                    "Anti-microbial coating application",
                    "Mobile app with sanitization reports",
                    "Perfect for team environments",
                    "Energy efficient operation"
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-violet-500/20 flex items-center justify-center mt-0.5">
                        <CheckCircle className="h-4 w-4 text-violet-400" />
                      </div>
                      <span className="ml-3 text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={toggleCalendly}
                    className="bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white transition-all"
                  >
                    Request Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {/* Trust Badge */}
                <div className="mt-12 flex items-center gap-4 p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="bg-white/10 p-2 rounded-md">
                    <ShieldCheck className="h-8 w-8 text-violet-400" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Trusted by Professional Teams</div>
                    <div className="text-sm text-gray-400">Used by 80+ sports organizations worldwide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Calendly Modal */}
      {showCalendly && (
        <div 
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && toggleCalendly()}
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Book a Consultation</h2>
              <Button variant="ghost" onClick={toggleCalendly} size="sm" className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <Calendly url="https://calendly.com/admin-helmetprosolutions/30min" />
          </div>
        </div>
      )}
    </>
  )
}