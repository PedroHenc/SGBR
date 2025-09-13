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
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DeleteCategoryDialogProps {
  category: Category | null;
  onDeleteCategory: (categoryId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCategoryDialog(
  { category, onDeleteCategory, open, onOpenChange }: DeleteCategoryDialogProps,
) {
  if (!category) {
    return null;
  }

  const handleDelete = () => {
    onDeleteCategory(category.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Categoria</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a categoria{" "}
            <span className="font-bold">{category.name}</span>? Esta ação não
            pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            className={cn(buttonVariants({ variant: "destructive" }))}
            onClick={handleDelete}
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
