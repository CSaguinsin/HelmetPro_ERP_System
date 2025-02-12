"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Button } from "@/components/ui/button"

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
  
    // Use environment variable for the script URL
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
      const response = await fetch(scriptURL, {
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
  
  const contactInfo = [
    {
      icon: FaPhone,
      text: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+1 234 567 890",
      href: `tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE?.replace(/\s+/g, "")}`,
    },
    {
      icon: FaEnvelope,
      text: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@example.com",
      href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`,
    },
    {
      icon: FaMapMarkerAlt,
      text: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "Address",
      href: process.env.NEXT_PUBLIC_MAPS_URL || "#",
    },
  ];

  // Rest of the component remains the same
  return (
    <section id="contact" className="py-24 md:py-32 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Previous JSX remains the same */}
      <div className="container mx-auto max-w-6xl px-6 text-center">
        <motion.h2 
          className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6" 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          Get in Touch
        </motion.h2>

        <motion.p 
          className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto" 
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          We're here to help! Whether you have questions about our <strong>Helmet Cleaning Vending Machine</strong>, feedback, or just want to say hello, reach out to us via email, phone, or visit our office. We look forward to connecting with you!
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact Info Section */}
          <motion.div variants={staggerChildren} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <div className="space-y-6">
              {contactInfo.map(({ icon: Icon, text, href }) => (
                <motion.a
                  key={text}
                  href={href}
                  className="flex items-center gap-4 text-lg justify-center lg:justify-start hover:text-blue-400 transition-colors"
                  variants={fadeInUp}
                >
                  <Icon size={24} color="#60A5FA" />
                  <span>{text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-lg"
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="tel"
                placeholder="Contact Number"
                required
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <textarea
                placeholder="Message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;