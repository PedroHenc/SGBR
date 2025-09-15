"use client";

import { AddTransactionDialog } from "@/components/dashboard/add-transaction-dialog";
import { EditTransactionDialog } from "@/components/dashboard/edit-transaction-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import type { Category, Collaborator, Transaction } from "@/lib/types";
import { format } from "date-fns";
import { Edit, FileDown } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type SerializableTransaction = Omit<Transaction, "date"> & { date: string };

interface ReportsClientProps {
  initialTransactions: SerializableTransaction[];
  initialCategories: Category[];
  initialCollaborators: Collaborator[];
}

const ITEMS_PER_PAGE = 5;

export function ReportsClient(
  { initialTransactions, initialCategories, initialCollaborators }:
    ReportsClientProps,
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [collaborators, setCollaborators] = useState<Collaborator[]>(
    initialCollaborators,
  );

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Transaction | null
  >(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const parsedTransactions = initialTransactions
      .map((t) => ({ ...t, date: new Date(t.date) }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    setTransactions(parsedTransactions);
  }, [initialTransactions]);

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleAddTransaction = (
    newTransaction: Omit<Transaction, "id" | "date">,
  ) => {
    setTransactions((prev) =>
      [
        { ...newTransaction, id: String(prev.length + 1), date: new Date() },
        ...prev,
      ].sort((a, b) => b.date.getTime() - a.date.getTime())
    );
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

  const handleExportCSV = () => {
    const csvHeader = [
      "Descrição",
      "Tipo",
      "Valor",
      "Data",
      "Categoria",
      "Colaborador",
    ].join(",");

    const csvBody = transactions.map((t) => {
      const category = getCategory(t.categoryId);
      const createdAt = t.created_at ? new Date(t.created_at) : new Date();
      return [
        `"${t.description.replace(/"/g, '""')}"`,
        t.type === "revenue" ? "Receita" : "Despesa",
        t.amount,
        format(createdAt, "yyyy-MM-dd HH:mm"),
        `"${category?.name.replace(/"/g, '""') || "Sem categoria"}"`,
        `"${t.createdBy || getCollaborator(t.collaboratorId)?.name || "N/A"}"`,
      ].join(",");
    }).join("\n");

    const csvContent = `${csvHeader}\n${csvBody}`;

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "relatorios.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Todos os Relatórios
            </h1>
            <p className="text-muted-foreground">
              Visualize e gerencie todas as suas receitas e despesas.
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportCSV} variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
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

        <Card>
          <CardHeader>
            <CardTitle>Histórico de Relatórios</CardTitle>
            <CardDescription>
              Uma lista completa de todas as suas atividades financeiras.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((t) => {
                  const category = getCategory(t.categoryId);
                  const collaborator = getCollaborator(t.collaboratorId);
                  const creatorName = t.createdBy || collaborator?.name ||
                    "N/A";
                  return (
                    <TableRow key={t.id}>
                      <TableCell>
                        <div className="font-medium">{t.description}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={collaborator?.avatarUrl}
                              alt={creatorName}
                            />
                            <AvatarFallback>
                              {creatorName.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="hidden sm:inline-block">
                            {creatorName}
                          </span>
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
                      <TableCell>
                        {isClient && (
                          <span>
                            {t.created_at
                              ? format(
                                new Date(t.created_at),
                                "dd/MM/yyyy HH:mm",
                              )
                              : "N/A"}
                          </span>
                        )}
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
          <CardFooter>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Próximo
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
      <EditTransactionDialog
        transaction={selectedTransaction}
        categories={categories}
        collaborators={collaborators}
        onEditTransaction={handleEditTransaction}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}
