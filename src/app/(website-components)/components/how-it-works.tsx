import { ArrowRight } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold mb-4">Clean Your Helmet in Three Simple Steps</h2>
          <p className="text-muted-foreground">
            Our smart stations use advanced technology to provide thorough cleaning and sanitization in minutes, keeping
            you safe on every ride.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-white shadow-lg"
            >
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-blue-500">{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>

              {index < steps.length - 1 && (
                <ArrowRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-blue-500" />
              )}
            </div>
          ))}
        </div>
      </div>
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

