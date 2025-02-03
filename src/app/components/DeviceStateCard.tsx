"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts"

const data = [
  { name: "Active", value: 400 },
  { name: "Inactive", value: 300 },
  { name: "Maintenance", value: 200 },
]

const COLORS = ["#3B82F6", "#1F2937", "#E5E7EB"]

export default function DeviceStateCard() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Device State</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

