"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, DollarSign, Star, Truck, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const MotionCard = motion(Card)

export default function StorePerformance() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const marketData = [
    { country: "United States", percentage: 20, color: "bg-primary/90" },
    { country: "France", percentage: 15, color: "bg-primary/80" },
    { country: "Canada", percentage: 13, color: "bg-primary/70" },
    { country: "UK", percentage: 9, color: "bg-primary/60" },
    { country: "Portugal", percentage: 11, color: "bg-primary/50" },
    { country: "Netherlands", percentage: 8, color: "bg-primary/40" },
    { country: "Asia", percentage: 17, color: "bg-primary/30" },
  ]

  return (
    <div className="bg-gradient-to-br from-background to-background/80 rounded-xl shadow-lg border border-border/40 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-2"
          >
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              HelmetPro Solutions
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">Performance metrics and market insights</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Performance trending upward</span>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <MotionCard
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-background/50 backdrop-blur-sm border-border/50 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">On-time delivery rate</CardTitle>
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Truck className="h-4 w-4 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl md:text-3xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {mounted && <Counter from={0} to={99.98} duration={2} decimals={1} suffix="%" />}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">Exceeding industry average</p>
            </CardContent>
          </MotionCard>

          <MotionCard
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-background/50 backdrop-blur-sm border-border/50 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Online revenue</CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-blue-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Total revenue from sales</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl md:text-3xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {mounted && <Counter from={0} to={750000} duration={2} prefix="US$ " suffix="+" />}
              </motion.div>
              <p className="text-xs text-muted-foreground mt-1">12% increase from last quarter</p>
            </CardContent>
          </MotionCard>

          <MotionCard
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-background/50 backdrop-blur-sm border-border/50 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-purple-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Response time</CardTitle>
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">≤3h</div>
              <p className="text-xs text-muted-foreground mt-1">Industry-leading support</p>
            </CardContent>
          </MotionCard>

          <MotionCard
            variants={item}
            whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            transition={{ duration: 0.2 }}
            className="bg-background/50 backdrop-blur-sm border-border/50 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">Store rating</CardTitle>
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
                <Star className="h-4 w-4 text-amber-500" />
              </div>
            </CardHeader>
            <CardContent>
              <motion.div
                className="text-2xl md:text-3xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {mounted && <Counter from={0} to={4.8} duration={2} decimals={1} />}
              </motion.div>
              <div className="flex items-center mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 ${i < 4 ? "text-amber-500" : "text-amber-500/30"}`}
                      fill={i < 4 ? "currentColor" : "none"}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground ml-2">Based on 200+ reviews</span>
              </div>
            </CardContent>
          </MotionCard>
        </motion.div>

        <MotionCard
          variants={item}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.5 }}
          className="bg-background/50 backdrop-blur-sm border-border/50 overflow-hidden"
        >
          <CardHeader className="border-b border-border/30">
            <CardTitle className="text-lg md:text-xl flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-primary" />
              </div>
              Main markets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="w-full h-10 flex rounded-lg overflow-hidden shadow-sm">
              {marketData.map((market, index) => (
                <motion.div
                  key={market.country}
                  className={`${market.color} relative group`}
                  style={{ width: `${market.percentage}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${market.percentage}%` }}
                  transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="w-full h-full">
                        <span className="absolute inset-0 flex items-center justify-center text-white text-xs md:text-sm font-medium">
                          {market.percentage}%
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{market.country}</p>
                        <p className="text-xs text-muted-foreground">Market share: {market.percentage}%</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs md:text-sm">
              {marketData.map((market, index) => (
                <motion.div
                  key={market.country}
                  className="flex items-center gap-2 bg-background/80 p-2 rounded-lg border border-border/30"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1 + index * 0.05 }}
                >
                  <div className={`h-3 w-3 rounded-full ${market.color}`} />
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium">{market.country}</span>
                    <span className="text-muted-foreground">{market.percentage}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </MotionCard>
      </div>
    </div>
  )
}

interface CounterProps {
  from: number
  to: number
  duration?: number
  decimals?: number
  prefix?: string
  suffix?: string
}

function Counter({ from, to, duration = 2, decimals = 0, prefix = "", suffix = "" }: CounterProps) {
  const [current, setCurrent] = useState(from)

  useEffect(() => {
    const steps = 60
    const increment = (to - from) / steps
    const stepDuration = (duration * 1000) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep === steps) {
        setCurrent(to)
        clearInterval(timer)
      } else {
        setCurrent((prev) => {
          const next = prev + increment
          return Number(next.toFixed(decimals))
        })
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [from, to, duration, decimals])

  return (
    <span>
      {prefix}
      {current.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}

