
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import type { Category } from '@/lib/types';
import { EditCategoryDialog } from './edit-category-dialog';
import { DeleteCategoryDialog } from './delete-category-dialog';

interface CategoriesClientProps {
  initialCategories: Category[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da categoria deve ter pelo menos 2 caracteres.",
  }),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, {
    message: "A cor deve estar no formato hexadecimal (ex: #RRGGBB).",
  }),
});

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { toast } = useToast();

  const generateRandomColor = () => {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: generateRandomColor(),
    },
  });

  useEffect(() => {
    // Set an initial random color when the component mounts and the form is reset
    if (!form.getValues('color')) {
        form.setValue('color', generateRandomColor());
    }
  }, [form]);
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newCategory: Category = {
      id: String(categories.length + 1),
      name: values.name,
      color: values.color,
    };
    setCategories(prev => [...prev, newCategory]);
    toast({
      title: "Categoria Adicionada",
      description: `Categoria "${values.name}" adicionada com sucesso.`,
    });
    form.reset();
    form.setValue('color', generateRandomColor());
  }

  const handleEditCategory = (updatedCategory: Category) => {
    setCategories(prev =>
      prev.map(c => (c.id === updatedCategory.id ? updatedCategory : c))
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    const categoryName = categories.find(c => c.id === categoryId)?.name;
    setCategories(prev => prev.filter(c => c.id !== categoryId));
     toast({
      title: "Categoria Excluída",
      description: `Categoria "${categoryName}" foi excluída com sucesso.`,
    });
  };

  const openEditDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Categorias</h1>
          <p className="text-muted-foreground">Adicione novas categorias ou visualize as existentes.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Nova Categoria</CardTitle>
                <CardDescription>Crie uma nova categoria para suas transações.</CardDescription>
              </CardHeader>
              <CardContent>
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
                            <div className="flex items-center justify-between">
                                <FormLabel>Cor da Categoria</FormLabel>
                                <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => form.setValue('color', generateRandomColor(), { shouldValidate: true })}
                                >
                                <RefreshCw className="mr-2 h-3 w-3" />
                                Gerar Cor
                                </Button>
                            </div>
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
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Adicionar Categoria
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Categorias Existentes</CardTitle>
                <CardDescription>Aqui estão todas as suas categorias de transação atuais.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cor</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categories.map(category => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: category.color }} />
                            <span>{category.color}</span>
                          </div>
                        </TableCell>
                         <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(category)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(category)}>
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
      <EditCategoryDialog
        category={selectedCategory}
        onEditCategory={handleEditCategory}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteCategoryDialog
        category={selectedCategory}
        onDeleteCategory={handleDeleteCategory}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
