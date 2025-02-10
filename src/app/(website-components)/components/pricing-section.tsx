import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  return (
    <section id="pricing" className="py-24">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground">
            Choose the plan that best fits your riding frequency. All plans include our premium cleaning service.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card key={plan.name} className={`flex flex-col ${plan.featured ? "border-blue-500 shadow-blue-100" : ""}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  {plan.interval && <span className="text-muted-foreground">/{plan.interval}</span>}
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className={`w-full ${plan.featured ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}`}
                  variant={plan.featured ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

const plans = [
  {
    name: "Basic Clean",
    description: "Perfect for occasional riders",
    price: "15",
    interval: "clean",
    features: ["Standard sanitization", "15-minute service", "Basic helmet inspection", "Available at all locations"],
  },
  {
    name: "Pro Membership",
    description: "Best for regular riders",
    price: "49",
    interval: "month",
    featured: true,
    features: [
      "Unlimited cleanings",
      "Priority service",
      "Advanced sanitization",
      "Helmet health monitoring",
      "Member-only locations",
    ],
  },
  {
    name: "Business",
    description: "For riding schools & rentals",
    price: "199",
    interval: "month",
    features: ["Multiple helmet cleaning", "Business dashboard", "API access", "Dedicated support", "Custom solutions"],
  },
]

