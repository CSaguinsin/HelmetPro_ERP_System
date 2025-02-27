"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Phone, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import Footer from "../components/footer";
import { SiteHeader } from "../components/site-header";

// Create custom tabs component since @/components/ui/tabs is not available
const TabsContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="w-full">{children}</div>;
};

const TabsList = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return <div className={className}>{children}</div>;
};

const TabsTrigger = ({ 
  children, 
  className, 
  id, 
  active, 
  onClick 
}: { 
  children: React.ReactNode, 
  className?: string, 
  // Removed unused 'value' prop
  id?: string, 
  active: boolean,
  onClick: () => void 
}) => {
  return (
    <button 
      id={id} 
      className={`${className} ${active ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ 
  children, 
  className, 
  value, 
  activeValue 
}: { 
  children: React.ReactNode, 
  className?: string, 
  value: string,
  activeValue: string
}) => {
  if (value !== activeValue) return null;
  return <div className={className}>{children}</div>;
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.2 } },
};

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState<string>("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [calendlyLoaded, setCalendlyLoaded] = useState(false);
  const calendlyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Calendly script
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.onload = () => setCalendlyLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Clean up
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Effect to initialize Calendly when tab is active and script is loaded
  useEffect(() => {
    if (activeTab === "schedule" && calendlyLoaded && calendlyRef.current && window.Calendly) {
      // Clear the container first
      calendlyRef.current.innerHTML = "";
      
      // Initialize Calendly
      window.Calendly.initInlineWidget({
        url: "https://calendly.com/admin-helmetprosolutions/30min",
        parentElement: calendlyRef.current,
        prefill: {},
        utm: {}
      });
    }
  }, [activeTab, calendlyLoaded]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scriptURL = process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;
    
    if (!scriptURL) {
      console.error("Google Script URL not configured");
      alert("Configuration error. Please contact support.");
      setIsSubmitting(false);
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    try {
      await fetch(scriptURL, {
        method: "POST",
        mode: "no-cors",
        body: form
      });

      setShowThankYou(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      
    } catch (error) {
      console.error("❌ Submission Error:", error);
      alert("Submission failed. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapUrl = process.env.NEXT_PUBLIC_MAPS_EMBED_URL || 
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.6682928913924!2d120.9863951!3d14.3885938!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d3b0e5a510eb%3A0x66d07e63c978d0e4!2sHelmetPRO%20-%20Helmet%20Cleaning%20Vending%20Machine!5e0!3m2!1sen!2sph!4v1739496538887!5m2!1sen!2sph";

  const contactInfo = [
    {
      icon: Phone,
      text: "+63 962 816 4788",
      href: "tel:+639628164788",
    },
    {
      icon: Mail,
      text: "partnerships@helmetprosolutions.com",
      href: "mailto:partnerships@helmetprosolutions.com",
    },
    {
      icon: Calendar,
      text: "Schedule a Call",
      href: "#schedule",
      isAction: true,
      onClick: () => setActiveTab("schedule"),
    },
  ];

  return (
    <>
      <SiteHeader />
      <section id="contact" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12 sm:mb-16"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-3 sm:mb-4">
              Get in Touch
            </h2>
            <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-4 sm:px-0">
              Have questions about our solutions? Reach out directly, schedule a call, or fill the form. We are here to help!
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6 sm:space-y-8">
              <motion.div 
                className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10"
                variants={staggerChildren}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="space-y-4 sm:space-y-6">
                  {contactInfo.map(({ icon: Icon, text, href, isAction, onClick }) => (
                    <motion.a
                      key={text}
                      href={href}
                      onClick={(e) => {
                        if (onClick) {
                          e.preventDefault();
                          onClick();
                        }
                      }}
                      className={`flex items-center gap-3 sm:gap-4 text-gray-300 hover:text-white transition-colors group ${isAction ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 p-2 rounded-lg' : ''}`}
                      variants={fadeInUp}
                    >
                      <div className={`p-2 sm:p-3 ${isAction ? 'bg-blue-500' : 'bg-white/10'} rounded-lg group-hover:bg-blue-500 transition-colors`}>
                        <Icon size={20} className={`${isAction ? 'text-white' : 'text-blue-400'} group-hover:text-white sm:w-6 sm:h-6`} />
                      </div>
                      <span className="text-base sm:text-lg font-medium break-all sm:break-normal">{text}</span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              <motion.div
                className="rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-white/10 h-[300px] sm:h-[400px]"
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all"
                />
              </motion.div>
            </div>

            <motion.div
              className="bg-white/5 backdrop-blur-lg rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-xl border border-white/10"
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <TabsContainer>
                <TabsList className="grid grid-cols-2 w-full mb-6 rounded-lg bg-white/10">
                  <TabsTrigger 
                    active={activeTab === "form"}
                    onClick={() => setActiveTab("form")}
                    className="rounded-md py-2 px-4 font-medium transition-all"
                  >
                    Contact Form
                  </TabsTrigger>
                  <TabsTrigger 
                    id="schedule" 
                    active={activeTab === "schedule"}
                    onClick={() => setActiveTab("schedule")}
                    className="rounded-md py-2 px-4 font-medium transition-all"
                  >
                    Schedule a Call
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="form" activeValue={activeTab} className="mt-0">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 text-sm sm:text-base"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 text-sm sm:text-base"
                        placeholder="john@company.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 text-sm sm:text-base"
                        placeholder="+1 234 567 890"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1 sm:mb-2">Message</label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400 text-sm sm:text-base"
                        placeholder="How can we help you?"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 h-10 sm:h-12 text-sm sm:text-base"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="schedule" activeValue={activeTab} className="mt-0 h-[700px]">
                  <div 
                    ref={calendlyRef}
                    className="w-full h-full"
                  ></div>
                </TabsContent>
              </TabsContainer>
            </motion.div>
          </div>
        </div>
      </section>

      <AlertDialog open={showThankYou} onOpenChange={setShowThankYou}>
        <AlertDialogContent className="bg-white max-w-lg mx-4">
          <AlertDialogHeader>
            <div className="flex justify-center">
              <Image
                src="/helmet-pro/logo.jpeg"
                alt="Logo"
                width={80}
                height={80}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg shadow-md"
              />
            </div>
            <AlertDialogTitle className="flex items-center pb-2 gap-2 text-xl sm:text-2xl md:text-3xl bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold leading-tight text-center">
              Thank You for Reaching Out!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 text-sm sm:text-base space-y-4 text-center">
              We have received your message and appreciate you taking the time to contact us. Our team will review your inquiry and get back to you as soon as possible.
              
              You can expect to hear in a minute.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              onClick={() => setShowThankYou(false)}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 w-full sm:w-auto"
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Footer />
    </>
  );
}

// Add TypeScript declaration for Calendly
declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}