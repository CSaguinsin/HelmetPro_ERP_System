import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle } from "lucide-react"
import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative overflow-hidden pt-16 md:pt-24">
      <div className="container relative z-10">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <Badge className="w-fit mx-auto lg:mx-0" variant="secondary">
              🎉 Now available in over 100 locations
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Smart Helmet Cleaning for the{" "}
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Modern Rider
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Experience the future of helmet maintenance with our AI-powered cleaning stations. 15-minute sanitization
              that keeps you safe and your helmet pristine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                Find Nearest Station
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline">
                Watch How It Works
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-4">
              {["99.9% Sanitization", "15-Min Clean", "Smart Detection"].map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative lg:h-[600px]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-3xl" />
            <div className="relative h-full w-full">
              <Image
                src="/placeholder.svg"
                alt="Smart Helmet Cleaning Station"
                width={600}
                height={600}
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

