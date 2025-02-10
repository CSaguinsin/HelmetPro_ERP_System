import { Shield, Clock, MapPin, Smartphone, Sparkles, Banknote } from "lucide-react"

export function FeaturesSection() {
  return (
    <section id="features" className="container space-y-12 py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Advanced Features for Modern Riders
        </h2>
        <p className="max-w-[85%] text-muted-foreground md:text-xl">
          Our smart vending machines offer state-of-the-art helmet cleaning technology with convenience and reliability.
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div key={feature.title} className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="font-bold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const features = [
  {
    icon: Shield,
    title: "Advanced Sanitization",
    description: "Professional-grade cleaning technology that eliminates 99.9% of bacteria and viruses.",
  },
  {
    icon: Clock,
    title: "Quick Service",
    description: "Complete helmet cleaning and sanitization in under 15 minutes.",
  },
  {
    icon: MapPin,
    title: "Convenient Locations",
    description: "Find our vending machines at popular motorcycle spots and major locations.",
  },
  {
    icon: Smartphone,
    title: "Smart Technology",
    description: "Mobile app integration for easy payments and location finding.",
  },
  {
    icon: Sparkles,
    title: "Premium Care",
    description: "Gentle yet effective cleaning process that preserves helmet integrity.",
  },
  {
    icon: Banknote,
    title: "Affordable Pricing",
    description: "Cost-effective solution for regular helmet maintenance and cleaning.",
  },
]

