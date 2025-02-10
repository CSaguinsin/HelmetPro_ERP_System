import { SiteHeader } from "../components/site-header"
import { HeroSection } from "../components/hero-section"
import { HowItWorks } from "../components/how-it-works"
import { PricingSection } from "../components/pricing-section"
import { Button } from "@/components/ui/button"
import { MapPin, Mail, Phone } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />

        {/* Stats Section */}
        <section className="py-24 bg-gradient-to-r from-blue-500 to-cyan-500">
          <div className="container">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center text-white">
                  <div className="text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection />

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-slate-50">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Experience the Future?</h2>
                <p className="text-muted-foreground mb-8">
                  Get in touch with our team to learn more about HelmetPro solutions or partnership opportunities.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: MapPin, text: "Find locations near you" },
                    { icon: Mail, text: "support@helmetpro.com" },
                    { icon: Phone, text: "(555) 123-4567" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-blue-500" />
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <form className="space-y-4">
                  <input type="text" placeholder="Name" className="w-full p-3 rounded-lg border" />
                  <input type="email" placeholder="Email" className="w-full p-3 rounded-lg border" />
                  <textarea placeholder="Message" rows={4} className="w-full p-3 rounded-lg border" />
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">Send Message</Button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-200 py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="rounded-lg bg-white/10 p-2">

                </div>
                <span className="text-xl font-bold">HelmetPro</span>
              </div>
              <p className="text-slate-400">The future of helmet cleaning and maintenance.</p>
            </div>
            {footerLinks.map((section) => (
              <div key={section.title}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-slate-400 hover:text-white transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            © {new Date().getFullYear()} HelmetPro. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

const stats = [
  { value: "100+", label: "Locations" },
  { value: "50K+", label: "Helmets Cleaned" },
  { value: "99.9%", label: "Sanitization Rate" },
  { value: "4.9/5", label: "Customer Rating" },
]

const footerLinks = [
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Blog"],
  },
  {
    title: "Product",
    links: ["Features", "Pricing", "Security", "Enterprise"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Support", "API", "Partner Program"],
  },
]



