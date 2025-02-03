"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Mon", value: 90 },
  { name: "Tue", value: 85 },
  { name: "Wed", value: 92 },
  { name: "Thu", value: 88 },
  { name: "Fri", value: 95 },
  { name: "Sat", value: 78 },
  { name: "Sun", value: 82 },
]

export default function OperatingStatusCard() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Operating Status</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

