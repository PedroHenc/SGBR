
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DailyRevenueCardProps {
  totalRevenue: number;
}

const data = [
  { revenue: 10000, goal: 8000 },
  { revenue: 9000, goal: 7500 },
  { revenue: 8000, goal: 7000 },
  { revenue: 11000, goal: 9000 },
  { revenue: 12000, goal: 9500 },
  { revenue: 10500, goal: 8500 },
  { revenue: 13000, goal: 10000 },
]

export function DailyRevenueCard({ totalRevenue }: DailyRevenueCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise de Receita Diária</CardTitle>
        <CardDescription>
          Você ganhou {formatCurrency(totalRevenue)} hoje.
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}K`}
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
