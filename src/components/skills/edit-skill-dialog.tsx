
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
import type { Skill } from '@/lib/types';

interface EditSkillDialogProps {
  skill: Skill | null;
  onEditSkill: (skill: Skill) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da competência deve ter pelo menos 2 caracteres.",
  }),
});

export function EditSkillDialog({ skill, onEditSkill, open, onOpenChange }: EditSkillDialogProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (skill) {
      form.reset({
        name: skill.name,
      });
    }
  }, [skill, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!skill) return;

    onEditSkill({
      ...skill,
      ...values,
    });
    toast({
      title: "Competência Atualizada",
      description: `Competência "${values.name}" foi atualizada com sucesso.`,
    });
    onOpenChange(false);
  }

  const title = 'Editar Competência';
  const description = 'Atualize os detalhes da competência.';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {skill && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Competência</FormLabel>
                    <FormControl>
                      <Input placeholder="ex: React" {...field} />
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
