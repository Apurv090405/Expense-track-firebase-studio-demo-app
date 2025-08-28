
'use client';

import { useState } from 'react';
import {
  DollarSign,
  PiggyBank,
  Wallet,
  ArrowUpRight,
  Sparkles,
  BarChart,
  TrendingUp,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import { useAppContext } from '@/context/app-context';
import { getFinancialTips } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const { expenses, budgets } = useAppContext();
  const [insights, setInsights] = useState('');
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = budgets.reduce((sum, bud) => sum + bud.amount, 0);
  const remainingBudget = totalBudget - totalExpenses;
  const recentExpenses = expenses.slice(0, 5);

  const handleGetInsights = async () => {
    setIsLoadingInsights(true);
    setInsights('');
    try {
      const result = await getFinancialTips(expenses);
      setInsights(result.tips);
    } catch (error) {
      setInsights('Failed to get financial insights. Please try again.');
    } finally {
      setIsLoadingInsights(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a snapshot of your finances.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Total spending across all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Your total budget for all categories
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                remainingBudget < 0 ? 'text-destructive' : 'text-primary'
              }`}
            >
              ${remainingBudget.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {remainingBudget >= 0 ? 'Funds left to spend' : 'Over budget'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>
                  Your last few transactions.
                </CardDescription>
              </div>
              <Link href="/expenses" passHref>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            {recentExpenses.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        <div className="font-medium">{expense.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {expense.category}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(new Date(expense.date), 'dd MMM')}
                      </TableCell>
                      <TableCell className="text-right">
                        ${expense.amount.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <Wallet className="h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 font-semibold">No expenses yet</p>
                    <p className="text-sm text-muted-foreground">Add an expense to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <CardTitle>Financial Insights</CardTitle>
                    <CardDescription>
                    AI-powered tips to help you save money.
                    </CardDescription>
                </div>
                <Button
                    variant="default"
                    size="sm"
                    onClick={handleGetInsights}
                    disabled={isLoadingInsights}
                >
                    {isLoadingInsights ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate Tips
                </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex items-center justify-center">
            {isLoadingInsights ? (
              <div className="text-center text-muted-foreground">
                <Loader2 className="mx-auto h-8 w-8 animate-spin" />
                <p className="mt-2">Analyzing your spending...</p>
              </div>
            ) : insights ? (
              <Alert>
                <TrendingUp className="h-4 w-4" />
                <AlertTitle>Your Personalized Tips</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap">
                  {insights}
                </AlertDescription>
              </Alert>
            ) : (
                <div className="text-center text-muted-foreground">
                    <BarChart className="mx-auto h-12 w-12" />
                    <p className="mt-4 font-semibold">Ready for some advice?</p>
                    <p className="text-sm">Click "Generate Tips" to get started.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
