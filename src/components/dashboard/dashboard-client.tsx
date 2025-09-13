"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit, FileDown, PiggyBank, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { EditTransactionDialog } from "@/components/dashboard/edit-transaction-dialog";
import type { Category, Collaborator, Transaction } from "@/lib/types";
import { format } from "date-fns";
import { TeamCard } from "./team-card";
import { MonthlyReportsChart } from "./monthly-reports-chart";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { EditVaultDialog } from "./edit-vault-dialog";
import { ResetExpensesDialog } from "./reset-expenses-dialog";
import { useToast } from "@/hooks/use-toast";

type SerializableTransaction = Omit<Transaction, "date"> & { date: string };

interface DashboardClientProps {
  initialTransactions: SerializableTransaction[];
  initialCategories: Category[];
  initialCollaborators: Collaborator[];
}

const StatCard = (
  { title, value, icon: Icon, onClick, className }: {
    title: string;
    value: string;
    icon: React.ElementType;
    onClick?: () => void;
    className?: string;
  },
) => (
  <Card
    onClick={onClick}
    className={cn(className, onClick && "cursor-pointer hover:bg-muted/50")}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export function DashboardClient(
  { initialTransactions, initialCategories, initialCollaborators }:
    DashboardClientProps,
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories] = useState<Category[]>(initialCategories);
  const [collaborators] = useState<Collaborator[]>(initialCollaborators);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isVaultDialogOpen, setIsVaultDialogOpen] = useState(false);
  const [isResetExpensesDialogOpen, setIsResetExpensesDialogOpen] = useState(
    false,
  );
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | null
  >(null);
  const [animatedRowId, setAnimatedRowId] = useState<string | null>(null);
  const [vaultBaseValue, setVaultBaseValue] = useState(7345.67);

  const [isClient, setIsClient] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    setTransactions(
      initialTransactions.map((t) => ({ ...t, date: new Date(t.date) })),
    );
  }, [initialTransactions]);

  const { totalExpenses } = useMemo(() => {
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { totalExpenses };
  }, [transactions]);

  const monthlyReportsData = useMemo(() => {
    const monthlyCounts = Array(12).fill(0).map((_, i) => ({
      month: format(new Date(0, i), "MMM"),
      count: 0,
    }));

    const filteredTransactions = selectedCategories.length > 0
      ? transactions.filter((t) => selectedCategories.includes(t.categoryId))
      : transactions;

    filteredTransactions.forEach((t) => {
      const month = t.date.getMonth();
      monthlyCounts[month].count++;
    });

    return monthlyCounts;
  }, [transactions, selectedCategories]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const handleAddTransaction = (
    newTransaction: Omit<Transaction, "id" | "date">,
  ) => {
    const newId = String(transactions.length + 1);
    setTransactions((prev) =>
      [
        { ...newTransaction, id: newId, date: new Date() },
        ...prev,
      ].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
    setAnimatedRowId(newId);
    setTimeout(() => setAnimatedRowId(null), 1000);
  };

  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updatedTransaction.id ? updatedTransaction : t))
    );
  };

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const getCategory = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getCollaborator = (collaboratorId: string) => {
    return collaborators.find((c) => c.id === collaboratorId);
  };

  const handleExportRecentCSV = () => {
    const recentTransactions = transactions.slice(0, 5);
    const csvHeader = [
      "Descrição",
      "Tipo",
      "Valor",
      "Data",
      "Categoria",
      "Colaborador",
    ].join(",");
    const csvBody = recentTransactions.map((t) => {
      const category = getCategory(t.categoryId);
      const collaborator = getCollaborator(t.collaboratorId);
      return [
        `"${t.description.replace(/"/g, '""')}"`,
        t.type === "revenue" ? "Receita" : "Despesa",
        t.amount,
        format(t.date, "yyyy-MM-dd HH:mm"),
        `"${category?.name.replace(/"/g, '""') || "Sem categoria"}"`,
        `"${collaborator?.name.replace(/"/g, '""') || "N/A"}"`,
      ].join(",");
    }).join("\n");

    const csvContent = `${csvHeader}\n${csvBody}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorios_recentes.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleCategoryFilterChange = (categoryIds: string[]) => {
    setSelectedCategories(categoryIds);
  };

  const currentVaultValue = vaultBaseValue - totalExpenses;

  const handleVaultSave = (newAmount: number) => {
    setVaultBaseValue(newAmount);
  };

  const handleResetExpenses = () => {
    setTransactions((prev) => prev.filter((t) => t.type !== "expense"));
    toast({
      title: "Despesas Resetadas",
      description: "Todas as transações de despesas foram removidas.",
    });
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Bem-vindo(a) de volta!
            </h1>
            <p className="text-muted-foreground">
              Aqui está um resumo do desempenho da sua empresa.
            </p>
          </div>
          <div className="flex gap-2">
            <AddTransactionDialog
              type="revenue"
              categories={categories}
              collaborators={collaborators}
              onAddTransaction={handleAddTransaction}
            />
            <AddTransactionDialog
              type="expense"
              categories={categories}
              collaborators={collaborators}
              onAddTransaction={handleAddTransaction}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <StatCard
            title="Cofre"
            value={formatCurrency(currentVaultValue)}
            icon={PiggyBank}
            onClick={() => setIsVaultDialogOpen(true)}
          />
          <StatCard
            title="Despesas Totais"
            value={formatCurrency(totalExpenses)}
            icon={TrendingDown}
            onClick={() => setIsResetExpensesDialogOpen(true)}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Relatórios Recentes</CardTitle>
                <CardDescription>
                  Uma visão geral de suas últimas atividades financeiras.
                </CardDescription>
              </div>
              <Button
                onClick={handleExportRecentCSV}
                variant="outline"
                size="sm"
              >
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
                  {transactions.slice(0, 5).map((t) => {
                    const category = getCategory(t.categoryId);
                    const collaborator = getCollaborator(t.collaboratorId);
                    return (
                      <TableRow
                        key={t.id}
                        className={cn(
                          animatedRowId === t.id && "animate-row-cascade",
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8 hidden sm:flex">
                              <AvatarImage
                                src={collaborator?.avatarUrl}
                                alt={collaborator?.name}
                              />
                              <AvatarFallback>
                                {collaborator?.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{t.description}</div>
                              {isClient && (
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(t.date), "dd/MM/yyyy HH:mm")}
                                  {" "}
                                  por {collaborator?.name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            style={category
                              ? {
                                borderColor: category.color,
                                color: category.color,
                              }
                              : {}}
                          >
                            {category?.name || "Sem categoria"}
                          </Badge>
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            t.type === "revenue"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {t.type === "revenue" ? "+" : "-"}
                          {formatCurrency(t.amount)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(t)}
                          >
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
            <TeamCard
              collaborators={collaborators}
              transactions={transactions}
            />
            <MonthlyReportsChart
              data={monthlyReportsData}
              allCategories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryFilterChange}
            />
          </div>
        </div>
      </div>
      <EditTransactionDialog
        transaction={selectedTransaction}
        categories={categories}
        collaborators={collaborators}
        onEditTransaction={handleEditTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <EditVaultDialog
        currentAmount={vaultBaseValue}
        onSave={handleVaultSave}
        open={isVaultDialogOpen}
        onOpenChange={setIsVaultDialogOpen}
      />
      <ResetExpensesDialog
        onResetExpenses={handleResetExpenses}
        open={isResetExpensesDialogOpen}
        onOpenChange={setIsResetExpensesDialogOpen}
      />
    </>
  );
}
