import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";


export default function RevenueCalculator() {
  const [currency, setCurrency] = useState('PHP');
  const [unitPrice, setUnitPrice] = useState(100);
  const [helmetsPerDay, setHelmetsPerDay] = useState(25);
  const [fixedCosts, setFixedCosts] = useState(200);
  const [variableCost, setVariableCost] = useState(0.2);

  // Calculated values
  const [dailyRevenue, setDailyRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [monthlyCost, setMonthlyCost] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
  const [profitMargin, setProfitMargin] = useState(0);

  // Update calculations when inputs change
  useEffect(() => {
    const daily = helmetsPerDay * unitPrice;
    const monthly = daily * 30;
    const totalVariableCost = helmetsPerDay * variableCost * 30;
    const totalCost = totalVariableCost + fixedCosts;
    const profit = monthly - totalCost;
    const margin = (profit / monthly) * 100;

    setDailyRevenue(daily);
    setMonthlyRevenue(monthly);
    setMonthlyCost(totalCost);
    setGrossProfit(profit);
    setProfitMargin(margin);
  }, [helmetsPerDay, unitPrice, fixedCosts, variableCost]);

  return (
    <div className="grid md:grid-cols-2 gap-8 p-6 bg-gray-800 rounded-xl">
      {/* Input Section */}
      <div className="space-y-6">
        <h3 className="text-xl text-white font-semibold mb-6">
          Understand your revenue potential and manage costs effectively with the HelmetPro calculator. See how each wash contributes to your bottom line and maximize your profits!
        </h3>

        <div className="space-y-4">
          <div>
            <Label className="text-white">Currency</Label>
            <select 
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="PHP">₱ - PHP</option>
              <option value="USD">$ - USD</option>
            </select>
            <p className="text-sm text-gray-400 mt-1">Select the currency to display in calculations</p>
          </div>

          <div>
            <Label className="text-white">Unit Price (per wash)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                {currency === 'PHP' ? '₱' : '$'}
              </span>
              <Input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="pl-8 bg-gray-700 text-white border-gray-600"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Price per helmet wash in your selected currency</p>
          </div>

          <div>
            <Label className="text-white">Enter the Estimated Helmets Washed Daily</Label>
            <Input
              type="number"
              value={helmetsPerDay}
              onChange={(e) => setHelmetsPerDay(Number(e.target.value))}
              className="bg-gray-700 text-white border-gray-600"
            />
            <p className="text-sm text-gray-400 mt-1">Estimated percentage of machine utilization</p>
          </div>

          <div>
            <Label className="text-white">Fixed Costs (per month)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                {currency === 'PHP' ? '₱' : '$'}
              </span>
              <Input
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className="pl-8 bg-gray-700 text-white border-gray-600"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Fixed monthly costs for your machine (e.g., rent, maintenance)</p>
          </div>

          <div>
            <Label className="text-white">Variable Cost (per wash)</Label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">
                {currency === 'PHP' ? '₱' : '$'}
              </span>
              <Input
                type="number"
                value={variableCost}
                onChange={(e) => setVariableCost(Number(e.target.value))}
                className="pl-8 bg-gray-700 text-white border-gray-600"
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Cost per helmet wash (e.g., electricity, water)</p>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="bg-blue-800 p-8 rounded-xl">
        <h2 className="text-2xl text-white font-bold text-center mb-8">Revenue & Profit Summary</h2>

        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-blue-700 pb-4">
            <span className="text-white">Daily Revenue</span>
            <span className="text-2xl font-bold text-white">
              {currency === 'PHP' ? '₱' : '$'} {dailyRevenue.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-blue-700 pb-4">
            <span className="text-white">Monthly Revenue</span>
            <span className="text-2xl font-bold text-white">
              {currency === 'PHP' ? '₱' : '$'} {monthlyRevenue.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-blue-700 pb-4">
            <span className="text-white">Monthly Cost</span>
            <span className="text-2xl font-bold text-white">
              {currency === 'PHP' ? '₱' : '$'} {monthlyCost.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-blue-700 pb-4">
            <span className="text-white">Gross Profit</span>
            <span className="text-2xl font-bold text-green-400">
              {currency === 'PHP' ? '₱' : '$'} {grossProfit.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-blue-700 pb-4">
            <span className="text-white">Profit Margin</span>
            <span className="text-2xl font-bold text-yellow-400">
              {profitMargin.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="mt-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Maximize Your Profits!</h3>
          <p className="text-gray-300 mb-6">
            Optimize costs and increase revenue with HelmetPro. Discover new ways to boost your business and achieve success.
          </p>
          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}