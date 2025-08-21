
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
import type { Category } from '@/lib/types';

interface EditCategoryDialogProps {
  category: Category | null;
  onEditCategory: (category: Category) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da categoria deve ter pelo menos 2 caracteres.",
  }),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "A cor deve estar no formato hexadecimal (ex: #RRGGBB).",
  }),
});

export function EditCategoryDialog({ category, onEditCategory, open, onOpenChange }: EditCategoryDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
        color: category.color,
      });
    }
  }, [category, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!category) return;

    onEditCategory({
      ...category,
      ...values,
    });
    toast({
      title: "Categoria Atualizada",
      description: `Categoria "${values.name}" foi atualizada com sucesso.`,
    });
    onOpenChange(false);
  }

  const title = 'Editar Categoria';
  const description = 'Atualize os detalhes da categoria.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {category && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Categoria</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: Marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor da Categoria</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Input type="color" className="w-12 h-10 p-1" {...field} />
                        <Input placeholder="#RRGGBB" {...field} />
                      </div>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
