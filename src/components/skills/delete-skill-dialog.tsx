
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
import type { Skill } from '@/lib/types';
import { cn } from "@/lib/utils";

interface DeleteSkillDialogProps {
  skill: Skill | null;
  onDeleteSkill: (skillId: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteSkillDialog({ skill, onDeleteSkill, open, onOpenChange }: DeleteSkillDialogProps) {
  if (!skill) {
    return null;
  }

  const handleDelete = () => {
    onDeleteSkill(skill.id);
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Competência</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir a competência{" "}
            <span className="font-bold">{skill.name}</span>? Esta ação não pode ser desfeita.
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
