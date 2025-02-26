"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, DollarSign, Star, Truck } from "lucide-react"
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
    { country: "United States", percentage: 40, color: "bg-orange-400" },
    { country: "Vietnam", percentage: 14, color: "bg-amber-400" },
    { country: "Philippines", percentage: 13, color: "bg-yellow-400" },
    { country: "Cambodia", percentage: 9, color: "bg-yellow-300" },
    { country: "Indonesia", percentage: 7, color: "bg-yellow-200" },
    { country: "Other", percentage: 17, color: "bg-gray-200" },
  ]

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8">
      <motion.h1
        className="text-2xl md:text-3xl font-bold tracking-tight"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        HelmetPro Solutions Performance
      </motion.h1>

      <motion.div
        className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <MotionCard variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
              On-time delivery rate
            </CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-xl md:text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {mounted && <Counter from={0} to={99.98} duration={2} decimals={1} suffix="%" />}
            </motion.div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Online revenue</CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total revenue from sales</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-xl md:text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {mounted && <Counter from={0} to={750000} duration={2} prefix="US$ " suffix="+" />}
            </motion.div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Response time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl md:text-2xl font-bold">≤3h</div>
          </CardContent>
        </MotionCard>

        <MotionCard variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">Store rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <motion.div
              className="text-xl md:text-2xl font-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {mounted && <Counter from={0} to={4.8} duration={2} decimals={1} />}
            </motion.div>
          </CardContent>
        </MotionCard>
      </motion.div>

      <MotionCard variants={item} initial="hidden" animate="show" transition={{ delay: 0.5 }}>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Main markets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="w-full h-8 flex rounded-lg overflow-hidden">
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
                      <p>{market.country}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs md:text-sm text-muted-foreground">
            {marketData.map((market) => (
              <motion.div
                key={market.country}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <div className={`h-3 w-3 rounded ${market.color}`} />
                <span>{market.country}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </MotionCard>
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

