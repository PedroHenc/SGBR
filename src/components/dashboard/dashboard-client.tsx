
"use client";

import { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import { EditTransactionDialog } from '@/components/dashboard/edit-transaction-dialog';
import type { Transaction, Category } from '@/lib/types';
import { DateRange } from 'react-day-picker';
import { addDays, format, startOfDay, endOfDay } from 'date-fns';
import { DailyRevenueCard } from './daily-revenue-card';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
  initialTransactions: Transaction[];
  initialCategories: Category[];
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

export function DashboardClient({ initialTransactions, initialCategories }: DashboardClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.map(t => ({...t, date: new Date(t.date)})));
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  
  const today = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: startOfDay(addDays(today, -30)),
    to: endOfDay(today),
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const filteredTransactions = useMemo(() => {
    if (!date?.from) {
      return transactions;
    }
    const from = startOfDay(date.from);
    const to = date.to ? endOfDay(date.to) : endOfDay(date.from);
    return transactions.filter(t => t.date >= from && t.date <= to);
  }, [transactions, date]);


  const { totalRevenue, totalExpenses, profit } = useMemo(() => {
    const revenue = filteredTransactions
      .filter((t) => t.type === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      profit: revenue - expenses,
    };
  }, [filteredTransactions]);
  
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
                  {filteredTransactions.slice(0, 5).map(t => {
                    const category = getCategory(t.categoryId);
                    return (
                      <TableRow key={t.id}>
                        <TableCell>
                          <div className="font-medium">{t.description}</div>
                          {isClient && <div className="text-sm text-muted-foreground">{format(t.date, 'dd/MM/yyyy HH:mm')}</div>}
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
            <DailyRevenueCard totalRevenue={totalRevenue} transactions={filteredTransactions} />
            <Card>
              <CardHeader>
                <CardTitle>Filtrar por Data</CardTitle>
                <CardDescription>Selecione um período para visualizar as transações.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "dd/MM/y")} -{" "}
                              {format(date.to, "dd/MM/y")}
                            </>
                          ) : (
                            format(date.from, "dd/MM/y")
                          )
                        ) : (
                          <span>Selecione uma data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
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
