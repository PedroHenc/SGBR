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
import type { Collaborator } from '@/lib/types';
import { cn } from "@/lib/utils";

interface DeleteCollaboratorDialogProps {
  collaborator: Collaborator | null;
  onDeleteCollaborator: (collaboratorId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteCollaboratorDialog({ collaborator, onDeleteCollaborator, open, onOpenChange }: DeleteCollaboratorDialogProps) {
  if (!collaborator) {
    return null;
  }

  const handleDelete = () => {
    onDeleteCollaborator(collaborator.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Colaborador</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o colaborador{" "}
            <span className="font-bold">{collaborator.name}</span>? Esta ação não pode ser desfeita.
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
