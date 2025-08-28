
'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TrendingUp, PlusCircle, LineChart, Trash2 } from 'lucide-react';

import { useAppContext } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Investment } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const investmentSchema = z.object({
  name: z.string().min(1, 'Investment name is required.'),
  type: z.string().min(1, 'Type is required.'),
  quantity: z.coerce.number().positive('Quantity must be positive.'),
  purchasePrice: z.coerce.number().positive('Purchase price must be positive.'),
});

type InvestmentFormData = z.infer<typeof investmentSchema>;

const INVESTMENT_TYPES = ['Stock', 'Crypto', 'ETF', 'Mutual Fund', 'Other'];

export default function InvestmentsPage() {
  const { investments, addInvestment, updateInvestmentPrice, deleteInvestment } = useAppContext();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentSchema),
    defaultValues: {
      name: '',
      type: '',
      quantity: 0,
      purchasePrice: 0,
    },
  });

  const onSubmit = (data: InvestmentFormData) => {
    // In a real app, you'd fetch the current price from an API
    const currentPrice = data.purchasePrice * (1 + (Math.random() - 0.5) * 0.2);
    addInvestment({
      ...data,
      currentPrice,
    });
    toast({
      title: 'Investment Added',
      description: `Your investment in ${data.name} has been added.`,
    });
    setIsDialogOpen(false);
    form.reset();
  };

  // Use a ref to hold the dependencies for the interval callback
  const contextRef = useRef({ investments, updateInvestmentPrice });
  useEffect(() => {
    contextRef.current = { investments, updateInvestmentPrice };
  }, [investments, updateInvestmentPrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Access the latest values from the ref
      const { investments, updateInvestmentPrice } = contextRef.current;
      investments.forEach((inv) => {
        // Simulate price fluctuation
        const change = (Math.random() - 0.5) * 0.1;
        const newPrice = Math.max(0, inv.currentPrice * (1 + change));
        updateInvestmentPrice(inv.id, newPrice);
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []); // Empty dependency array ensures the effect runs only once

  const totalValue = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.currentPrice,
    0
  );
  const totalCost = investments.reduce(
    (sum, inv) => sum + inv.quantity * inv.purchasePrice,
    0
  );
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investments</h1>
          <p className="text-muted-foreground">Monitor your investment portfolio.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Investment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Investment</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name/Ticker</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AAPL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {INVESTMENT_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 10" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purchasePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Price per Share</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 150.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save Investment</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

       <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <p
              className={`text-3xl font-bold ${
                totalGainLoss >= 0 ? 'text-green-600' : 'text-destructive'
              }`}
            >
              {totalGainLoss >= 0 ? '+' : '-'}${Math.abs(totalGainLoss).toFixed(2)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Return</CardTitle>
          </CardHeader>
          <CardContent>
             <p
              className={`text-3xl font-bold ${
                totalGainLossPercent >= 0 ? 'text-green-600' : 'text-destructive'
              }`}
            >
              {totalGainLossPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>


      {investments.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto bg-secondary rounded-full p-3 w-fit">
              <LineChart className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="mt-4">No Investments Yet</CardTitle>
            <CardDescription>
              Add your first investment to start tracking your portfolio.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Purchase Price</TableHead>
                <TableHead className="text-right">Current Price</TableHead>
                <TableHead className="text-right">Total Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.map((inv) => {
                const totalValue = inv.quantity * inv.currentPrice;
                const costBasis = inv.quantity * inv.purchasePrice;
                const gainLoss = totalValue - costBasis;
                const gainLossColor =
                  gainLoss > 0
                    ? 'text-green-600'
                    : gainLoss < 0
                    ? 'text-destructive'
                    : 'text-muted-foreground';

                return (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.name}</TableCell>
                    <TableCell>{inv.type}</TableCell>
                    <TableCell className="text-right">{inv.quantity}</TableCell>
                    <TableCell className="text-right">
                      ${inv.purchasePrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${inv.currentPrice.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${totalValue.toFixed(2)}
                    </TableCell>
                    <TableCell className={`text-right ${gainLossColor}`}>
                      {gainLoss >= 0 ? '+' : '-'}${Math.abs(gainLoss).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button variant="ghost" size="icon" onClick={() => deleteInvestment(inv.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
