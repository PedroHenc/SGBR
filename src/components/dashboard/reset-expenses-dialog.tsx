
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResetExpensesDialogProps {
  onResetExpenses: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ResetExpensesDialog({ onResetExpenses, open, onOpenChange }: ResetExpensesDialogProps) {
  const handleReset = () => {
    onResetExpenses();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Resetar Despesas</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja resetar todas as despesas? Esta ação removerá todas as transações de despesa e não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={handleReset}
          >
            Resetar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
