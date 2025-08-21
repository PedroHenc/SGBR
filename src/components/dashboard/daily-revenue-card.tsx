"use client";

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import type { Transaction } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface DailyRevenueCardProps {
  totalRevenue: number;
  transactions: Transaction[];
}

const formSchema = z.object({
  dailyAmount: z.coerce.number().positive({
    message: "O valor da receita deve ser positivo.",
  }),
});

export function DailyRevenueCard({ totalRevenue, transactions }: DailyRevenueCardProps) {
  const [analysis, setAnalysis] = useState<{
    newTotal: number;
    difference: number;
    dailyAverage: number;
  } | null>(null);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dailyAmount: 0,
    },
  });

  const revenueTransactions = useMemo(() => transactions.filter(t => t.type === 'revenue'), [transactions]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const dailyAmount = values.dailyAmount;
    const newTotal = totalRevenue + dailyAmount;
    const difference = newTotal - totalRevenue;
    
    const uniqueDays = new Set(revenueTransactions.map(t => t.date.toDateString()));
    const dailyAverage = revenueTransactions.length > 0 ? totalRevenue / uniqueDays.size : 0;

    setAnalysis({
      newTotal,
      difference,
      dailyAverage,
    });
  };

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
        <CardDescription>Insira a receita do dia e compare com os totais.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dailyAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Receita do Dia (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="Ex: 500,00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Analisar Receita
            </Button>
          </form>
        </Form>
        {analysis && (
          <div className="mt-6 space-y-4">
            <Separator />
            <h3 className="text-lg font-medium">Resultado da Análise</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receita Total Anterior</span>
                <span>{formatCurrency(totalRevenue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Receita do Dia Inserida</span>
                <span className="text-green-500">+{formatCurrency(analysis.difference)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Nova Receita Total</span>
                <span>{formatCurrency(analysis.newTotal)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Média de Receita Diária</span>
                <span>{formatCurrency(analysis.dailyAverage)}</span>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => {
              setAnalysis(null);
              form.reset();
            }}>
              Limpar Análise
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
