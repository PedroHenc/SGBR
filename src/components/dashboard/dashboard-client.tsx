"use client";

import { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import { EditTransactionDialog } from '@/components/dashboard/edit-transaction-dialog';
import type { Transaction, Category, Appointment } from '@/lib/types';
import { DateRange } from 'react-day-picker';
import { addDays, format } from 'date-fns';
import { DailyRevenueCard } from './daily-revenue-card';

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
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.map(t => ({...t, date: new Date(t.date)})));
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments.map(a => ({...a, date: new Date(a.date)})));
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

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
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev =>
      [
        { ...newTransaction, id: String(prev.length + 1), date: new Date() },
        ...prev
      ].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev =>
      prev.map(t => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const getCategory = (categoryId: string) => {
    return categories.find(c => c.id === categoryId);
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Bem-vindo(a) de volta!</h1>
            <p className="text-muted-foreground">Aqui está um resumo do desempenho da sua empresa.</p>
          </div>
          <div className="flex gap-2">
            <AddTransactionDialog type="revenue" categories={categories} onAddTransaction={handleAddTransaction} />
            <AddTransactionDialog type="expense" categories={categories} onAddTransaction={handleAddTransaction} />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Receita Total" value={formatCurrency(totalRevenue)} icon={TrendingUp} trend="+20.1% do último mês" trendColor="text-green-500"/>
          <StatCard title="Despesas Totais" value={formatCurrency(totalExpenses)} icon={TrendingDown} trend="+12.5% do último mês" trendColor="text-red-500"/>
          <StatCard title="Lucro Líquido" value={formatCurrency(profit)} icon={DollarSign} trend="+19.2% do último mês" trendColor="text-green-500" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Transações Recentes</CardTitle>
              <CardDescription>Uma visão geral de suas últimas atividades financeiras.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.slice(0, 5).map(t => {
                    const category = getCategory(t.categoryId);
                    return (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="font-medium">{t.description}</div>
                          {isClient && <div className="text-sm text-muted-foreground">{format(t.date, 'dd/MM/yyyy')}</div>}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline"
                            style={category ? {
                              borderColor: category.color,
                              color: category.color,
                            } : {}}
                          >
                            {category?.name || 'Sem categoria'}
                          </Badge>
                        </TableCell>
                        <TableCell className={`text-right font-medium ${t.type === 'revenue' ? 'text-green-500' : 'text-red-500'}`}>
                          {t.type === 'revenue' ? '+' : '-'}
                          {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(t)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="lg:col-span-3 space-y-6">
            <DailyRevenueCard totalRevenue={totalRevenue} transactions={transactions} />
            <Card>
              <CardHeader>
                <CardTitle>Agendamentos</CardTitle>
                <CardDescription>Sua agenda para os próximos dias.</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="range"
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
      </div>
      <EditTransactionDialog
        transaction={selectedTransaction}
        categories={categories}
        onEditTransaction={handleEditTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
