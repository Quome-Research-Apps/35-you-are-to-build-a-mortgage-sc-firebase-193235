"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Scenario } from "@/types";
import { useMemo } from "react";

interface InterestChartProps {
  scenarios: Scenario[];
}

export function InterestChart({ scenarios }: InterestChartProps) {
  const chartData = useMemo(() => {
    return scenarios.map(scenario => ({
      name: scenario.name,
      "Total Interest": scenario.totalInterest,
    }));
  }, [scenarios]);
  
  const chartConfig = {
    "Total Interest": {
      label: "Total Interest Paid",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          className="text-xs"
        />
        <YAxis
          tickFormatter={(value) => `$${(Number(value) / 1000).toFixed(0)}k`}
          className="text-xs"
        />
        <Tooltip
          cursor={false}
          content={<ChartTooltipContent
              formatter={(value) => typeof value === 'number' ? value.toLocaleString("en-US", { style: "currency", currency: "USD" }) : ''}
              indicator="dot"
            />
          }
        />
        <Bar dataKey="Total Interest" fill="var(--color-Total-Interest)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
