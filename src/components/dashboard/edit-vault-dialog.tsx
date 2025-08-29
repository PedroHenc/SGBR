
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
import { useToast } from "@/hooks/use-toast";

interface EditVaultDialogProps {
  currentAmount: number;
  onSave: (newAmount: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  amount: z.coerce.number().min(0, {
    message: "O valor deve ser um número positivo.",
  }),
});

export function EditVaultDialog({ currentAmount, onSave, open, onOpenChange }: EditVaultDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (open) {
      form.reset({
        amount: currentAmount,
      });
    }
  }, [open, currentAmount, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSave(values.amount);
    toast({
      title: "Cofre Atualizado",
      description: `O valor do cofre foi atualizado com sucesso.`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Valor do Cofre</DialogTitle>
          <DialogDescription>
            Insira o novo valor base para o seu cofre. As despesas serão subtraídas deste valor.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Base do Cofre (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0,00" {...field} />
                  </FormControl>
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
      </DialogContent>
    </Dialog>
  );
}
