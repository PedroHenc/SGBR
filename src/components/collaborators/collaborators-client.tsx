
"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, User, Edit, Trash2, UploadCloud, X } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Collaborator } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { EditCollaboratorDialog } from './edit-collaborator-dialog';
import { DeleteCollaboratorDialog } from './delete-collaborator-dialog';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

interface CollaboratorsClientProps {
  initialCollaborators: Collaborator[];
  availableRoles: string[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do colaborador deve ter pelo menos 2 caracteres.",
  }),
  role: z.string().min(1, {
    message: "Por favor, selecione um cargo.",
  }),
  avatarUrl: z.string().optional(),
});

export function CollaboratorsClient({ initialCollaborators, availableRoles }: CollaboratorsClientProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      avatarUrl: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCollaborator: Collaborator = {
      id: String(collaborators.length + 1),
      name: values.name,
      role: values.role,
      avatarUrl: preview || values.avatarUrl,
    };
    setCollaborators(prev => [...prev, newCollaborator]);
    toast({
      title: "Colaborador Adicionado",
      description: `"${values.name}" foi adicionado com sucesso.`,
    });
    form.reset();
    setPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  const handleEditCollaborator = (updatedCollaborator: Collaborator) => {
    setCollaborators(prev =>
      prev.map(c => (c.id === updatedCollaborator.id ? updatedCollaborator : c))
    );
  };

  const handleDeleteCollaborator = (collaboratorId: string) => {
    const collaboratorName = collaborators.find(c => c.id === collaboratorId)?.name;
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    toast({
      title: "Colaborador Excluído",
      description: `"${collaboratorName}" foi excluído com sucesso.`,
    });
  };

  const openEditDialog = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsDeleteDialogOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  }

  return (
    <>
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
                    <FormItem>
                        <FormLabel>Foto do Colaborador</FormLabel>
                        <FormControl>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={preview || undefined} alt="Avatar do novo colaborador" />
                                    <AvatarFallback>
                                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid w-full max-w-sm items-center gap-1.5">
                                    <Label htmlFor="picture-new" className={cn("cursor-pointer", buttonVariants({ variant: "outline" }))}>
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        Carregar Imagem
                                    </Label>
                                    <Input id="picture-new" type="file" className="hidden" onChange={handleFileChange} accept="image/*" ref={fileInputRef} />
                                    {preview && (
                                        <Button variant="ghost" size="sm" onClick={handleRemoveImage} className="w-fit">
                                            <X className="mr-2 h-4 w-4" />
                                            Remover
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
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
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaborators.map(collaborator => (
                      <TableRow key={collaborator.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={collaborator.avatarUrl} alt={collaborator.name} data-ai-hint="person face" />
                              <AvatarFallback>{collaborator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            {collaborator.name}
                          </div>
                        </TableCell>
                        <TableCell>{collaborator.role}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(collaborator)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(collaborator)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <EditCollaboratorDialog
        collaborator={selectedCollaborator}
        onEditCollaborator={handleEditCollaborator}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        availableRoles={availableRoles}
      />
      <DeleteCollaboratorDialog
        collaborator={selectedCollaborator}
        onDeleteCollaborator={handleDeleteCollaborator}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
