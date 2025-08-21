"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Collaborator } from '@/lib/types';

interface EditCollaboratorDialogProps {
  collaborator: Collaborator | null;
  onEditCollaborator: (collaborator: Collaborator) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableRoles: string[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do colaborador deve ter pelo menos 2 caracteres.",
  }),
  role: z.string().min(1, {
    message: "Por favor, selecione um cargo.",
  }),
});

export function EditCollaboratorDialog({ collaborator, onEditCollaborator, open, onOpenChange, availableRoles }: EditCollaboratorDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (collaborator) {
      form.reset({
        name: collaborator.name,
        role: collaborator.role,
      });
    }
  }, [collaborator, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!collaborator) return;

    onEditCollaborator({
      ...collaborator,
      ...values,
    });
    toast({
      title: "Colaborador Atualizado",
      description: `"${values.name}" foi atualizado com sucesso.`,
    });
    onOpenChange(false);
  }

  const title = 'Editar Colaborador';
  const description = 'Atualize os detalhes do colaborador.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {collaborator && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Colaborador</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: João da Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo do Colaborador</FormLabel>
                     <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um cargo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRoles.map(role => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Salvar Alterações
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
