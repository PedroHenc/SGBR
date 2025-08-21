"use client";

import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import type { Transaction, Category, Appointment } from '@/lib/types';

interface DashboardClientProps {
  initialTransactions: Transaction[];
  initialCategories: Category[];
  initialAppointments: Appointment[];
}

const StatCard = ({ title, value, icon: Icon, trend, trendColor }: { title: string, value: string, icon: React.ElementType, trend?: string, trendColor?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && <p className={`text-xs text-muted-foreground ${trendColor}`}>{trend}</p>}
    </CardContent>
  </Card>
);

export function DashboardClient({ initialTransactions, initialCategories, initialAppointments }: DashboardClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const { totalRevenue, totalExpenses, profit } = useMemo(() => {
    const revenue = transactions
      .filter((t) => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      profit: revenue - expenses,
    };
  }, [transactions]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [
      { ...newTransaction, id: String(prev.length + 1), date: new Date() },
      ...prev
    ]);
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Uncategorized';
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back!</h1>
          <p className="text-muted-foreground">Here's a summary of your business performance.</p>
        </div>
        <div className="flex gap-2">
          <AddTransactionDialog type="revenue" categories={categories} onAddTransaction={handleAddTransaction} />
          <AddTransactionDialog type="expense" categories={categories} onAddTransaction={handleAddTransaction} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={TrendingUp} trend="+20.1% from last month" trendColor="text-accent"/>
        <StatCard title="Total Expenses" value={formatCurrency(totalExpenses)} icon={TrendingDown} trend="+12.5% from last month" trendColor="text-destructive"/>
        <StatCard title="Profit" value={formatCurrency(profit)} icon={DollarSign} trend="+19.2% from last month" trendColor="text-accent" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>An overview of your latest financial activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="font-medium">{t.description}</div>
                      <div className="text-sm text-muted-foreground">{t.date.toLocaleDateString()}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getCategoryName(t.categoryId)}</Badge>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${t.type === 'revenue' ? 'text-accent' : 'text-destructive'}`}>
                      {t.type === 'revenue' ? '+' : '-'}
                      {formatCurrency(t.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Your schedule for the upcoming days.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md"
              modifiers={{
                events: appointments.map(a => a.date)
              }}
              modifiersStyles={{
                events: {
                  color: 'hsl(var(--primary-foreground))',
                  backgroundColor: 'hsl(var(--primary))',
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
