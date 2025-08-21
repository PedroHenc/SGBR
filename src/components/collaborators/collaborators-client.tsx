"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import type { Collaborator } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface CollaboratorsClientProps {
  initialCollaborators: Collaborator[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do colaborador deve ter pelo menos 2 caracteres.",
  }),
  role: z.string().min(2, {
    message: "O cargo deve ter pelo menos 2 caracteres.",
  }),
});

export function CollaboratorsClient({ initialCollaborators }: CollaboratorsClientProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCollaborator: Collaborator = {
      id: String(collaborators.length + 1),
      name: values.name,
      role: values.role,
    };
    setCollaborators(prev => [...prev, newCollaborator]);
    toast({
      title: "Colaborador Adicionado",
      description: `"${values.name}" foi adicionado com sucesso.`,
    });
    form.reset();
  }

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Colaboradores</h1>
        <p className="text-muted-foreground">Adicione novos colaboradores ou visualize a equipe existente.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-5">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Adicionar Novo Colaborador</CardTitle>
              <CardDescription>Insira os dados do novo membro da equipe.</CardDescription>
            </CardHeader>
            <CardContent>
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
                        <FormControl>
                          <Input placeholder="ex: Desenvolvedor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Adicionar Colaborador
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
              <CardDescription>Aqui estão todos os colaboradores da sua empresa.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Cargo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {collaborators.map(collaborator => (
                    <TableRow key={collaborator.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={`https://placehold.co/40x40.png`} alt={collaborator.name} data-ai-hint="person face" />
                            <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {collaborator.name}
                        </div>
                      </TableCell>
                      <TableCell>{collaborator.role}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
