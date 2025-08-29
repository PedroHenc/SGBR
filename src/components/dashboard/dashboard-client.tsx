
"use client";

import { useState, useMemo, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Edit, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import { EditTransactionDialog } from '@/components/dashboard/edit-transaction-dialog';
import type { Transaction, Category, Collaborator } from '@/lib/types';
import { format } from 'date-fns';
import { TeamCard } from './team-card';
import { DailyRevenueCard } from './daily-revenue-card';
import { cn } from '@/lib/utils';

interface DashboardClientProps {
  initialTransactions: Transaction[];
  initialCategories: Category[];
  initialCollaborators: Collaborator[];
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

export function DashboardClient({ initialTransactions, initialCategories, initialCollaborators }: DashboardClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.map(t => ({...t, date: new Date(t.date)})));
  const [categories] = useState<Category[]>(initialCategories);
  const [collaborators] = useState<Collaborator[]>(initialCollaborators);
  
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [animatedRowId, setAnimatedRowId] = useState<string | null>(null);

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
    const newId = String(transactions.length + 1);
    setTransactions(prev =>
      [
        { ...newTransaction, id: newId, date: new Date() },
        ...prev
      ].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
    setAnimatedRowId(newId);
    setTimeout(() => setAnimatedRowId(null), 1000);
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

  const handleExportRecentCSV = () => {
    const recentTransactions = transactions.slice(0, 5);
    const csvHeader = ['Descrição', 'Tipo', 'Valor', 'Data', 'Categoria'].join(',');
    const csvBody = recentTransactions.map(t => {
      const category = getCategory(t.categoryId);
      return [
        `"${t.description.replace(/"/g, '""')}"`,
        t.type === 'revenue' ? 'Receita' : 'Despesa',
        t.amount,
        format(t.date, 'yyyy-MM-dd HH:mm'),
        `"${category?.name.replace(/"/g, '""') || 'Sem categoria'}"`
      ].join(',');
    }).join('\n');

    const csvContent = `${csvHeader}\n${csvBody}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorios_recentes.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Relatórios Recentes</CardTitle>
                <CardDescription>Uma visão geral de suas últimas atividades financeiras.</CardDescription>
              </div>
              <Button onClick={handleExportRecentCSV} variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
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
                      <TableRow key={t.id} className={cn(animatedRowId === t.id && 'animate-row-cascade')}>
                        <TableCell>
                          <div className="font-medium">{t.description}</div>
                          {isClient && <div className="text-sm text-muted-foreground">{format(new Date(t.date), 'dd/MM/yyyy HH:mm')}</div>}
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
            <TeamCard collaborators={collaborators} />
            <DailyRevenueCard totalRevenue={totalRevenue} />
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
