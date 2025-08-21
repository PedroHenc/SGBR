"use client";

import { useState, useEffect } from 'react';
import { Edit, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AddTransactionDialog } from '@/components/dashboard/add-transaction-dialog';
import { EditTransactionDialog } from '@/components/dashboard/edit-transaction-dialog';
import type { Transaction, Category } from '@/lib/types';
import { format } from 'date-fns';

interface TransactionsClientProps {
  initialTransactions: Transaction[];
  initialCategories: Category[];
}

export function TransactionsClient({ initialTransactions, initialCategories }: TransactionsClientProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions.map(t => ({...t, date: new Date(t.date)})));
  const [categories, setCategories] = useState<Category[]>(initialCategories);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [
      { ...newTransaction, id: String(prev.length + 1), date: new Date() },
      ...prev
    ].sort((a, b) => b.date.getTime() - a.date.getTime()));
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

  const handleExportCSV = () => {
    const csvHeader = ['Descrição', 'Tipo', 'Valor', 'Data', 'Categoria'].join(',');
    const csvBody = transactions.map(t => {
      const category = getCategory(t.categoryId);
      return [
        `"${t.description.replace(/"/g, '""')}"`,
        t.type === 'revenue' ? 'Receita' : 'Despesa',
        t.amount,
        format(t.date, 'yyyy-MM-dd'),
        `"${category?.name.replace(/"/g, '""') || 'Sem categoria'}"`
      ].join(',');
    }).join('\n');

    const csvContent = `${csvHeader}\n${csvBody}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "transacoes.csv");
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
            <h1 className="text-2xl font-bold tracking-tight">Todas as Transações</h1>
            <p className="text-muted-foreground">Visualize e gerencie todas as suas receitas e despesas.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <AddTransactionDialog type="revenue" categories={categories} onAddTransaction={handleAddTransaction} />
            <AddTransactionDialog type="expense" categories={categories} onAddTransaction={handleAddTransaction} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Transações</CardTitle>
            <CardDescription>Uma lista completa de todas as suas atividades financeiras.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map(t => {
                  const category = getCategory(t.categoryId);
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium">{t.description}</div>
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
                      <TableCell>
                        {isClient && <span>{format(t.date, 'dd/MM/yyyy')}</span>}
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
