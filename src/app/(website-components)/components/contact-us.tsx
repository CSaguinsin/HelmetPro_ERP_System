"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerChildren = {
  animate: { transition: { staggerChildren: 0.2 } },
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

      alert("✅ Your message has been sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
      
    } catch (error) {
      console.error("❌ Submission Error:", error);
      alert("Submission failed. Please check your internet connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const mapUrl = process.env.NEXT_PUBLIC_MAPS_EMBED_URL || 
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3864.6740398614957!2d120.98404967515013!3d14.38826168223996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d3923b0a80ed%3A0xaa763d5cde01dacf!2sAgoho%20St.%20Phase%202%20central!5e0!3m2!1sen!2sph!4v1739379760925!5m2!1sen!2sph";

  
  const contactInfo = [
    {
      icon: Phone,
      text: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1 234 567 890",
      href: `tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE?.replace(/\s+/g, "")}`,
    },
    {
      icon: Mail,
      text: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    },
    // {
    //   icon: MapPin,
    //   text: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Address",
    //   href: process.env.NEXT_PUBLIC_MAPS_URL || "#",
    // },
  ];

  return (
    <section id="contact" className="py-24 md:py-32 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 mb-4">
            Contact Us
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Have questions about our solutions? Reach out directly or fill the form. We are here to help!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8">
          {/* Left Column - Contact Info & Map */}
          <div className="space-y-8">
            <motion.div 
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                {contactInfo.map(({ icon: Icon, text, href }) => (
                  <motion.a
                    key={text}
                    href={href}
                    className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors group"
                    variants={fadeInUp}
                  >
                    <div className="p-3 bg-white/10 rounded-lg group-hover:bg-blue-500 transition-colors">
                      <Icon size={24} className="text-blue-400 group-hover:text-white" />
                    </div>
                    <span className="text-lg font-medium">{text}</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Map Section */}
            <motion.div
        className="rounded-2xl overflow-hidden shadow-xl border border-white/10"
        variants={fadeInUp}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <iframe
          src={mapUrl}
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="grayscale hover:grayscale-0 transition-all"
        />
      </motion.div>


          </div>

          {/* Right Column - Contact Form */}
          <motion.div
            className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/10"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-white placeholder-gray-400"
                  placeholder="How can we help you?"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 font-semibold py-6 text-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;