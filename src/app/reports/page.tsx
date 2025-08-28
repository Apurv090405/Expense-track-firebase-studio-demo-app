
'use client';

import { useMemo } from 'react';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { useAppContext } from '@/context/app-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
  "hsl(var(--chart-11))",
  "hsl(var(--chart-12))",
];

export default function ReportsPage() {
  const { expenses } = useAppContext();

  const spendingByCategory = useMemo(() => {
    if (expenses.length === 0) return [];

    const categoryMap = new Map<string, number>();
    for (const expense of expenses) {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    }

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
    }));
  }, [expenses]);

  const topSpendingCategory = useMemo(() => {
    if (spendingByCategory.length === 0) return null;
    return spendingByCategory.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );
  }, [spendingByCategory]);

  const totalSpending = useMemo(() => {
      return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">
          Visualize your spending habits and trends.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Spending</CardTitle>
            <CardDescription>Across all categories</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalSpending.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Category</CardTitle>
            <CardDescription>Your highest spending area</CardDescription>
          </CardHeader>
          <CardContent>
            {topSpendingCategory ? (
              <>
                <p className="text-3xl font-bold">{topSpendingCategory.name}</p>
                <p className="text-muted-foreground">
                  Spent ${topSpendingCategory.value.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">No spending data available.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
            <CardDescription>Number of expenses logged</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{expenses.length}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>
            A breakdown of your expenses by category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {spendingByCategory.length > 0 ? (
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendingByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {spendingByCategory.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `$${value.toFixed(2)}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center">
              <PieChartIcon className="h-16 w-16 text-muted-foreground" />
              <p className="mt-4 font-semibold">No data to display</p>
              <p className="text-sm text-muted-foreground">
                Add some expenses to see your spending chart.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
