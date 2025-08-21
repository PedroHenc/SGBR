
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from '@/components/ui/table';
import { useToast } from "@/hooks/use-toast";
import type { Skill } from '@/lib/types';
import { EditSkillDialog } from './edit-skill-dialog';
import { DeleteSkillDialog } from './delete-skill-dialog';

interface SkillsClientProps {
  initialSkills: Skill[];
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome da competência deve ter pelo menos 2 caracteres.",
  }),
});

export function SkillsClient({ initialSkills }: SkillsClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  
  function onSubmit(values: z.infer<typeof formSchema>) {
    const newSkill: Skill = {
      id: String(skills.length + 1),
      name: values.name,
    };
    setSkills(prev => [...prev, newSkill]);
    toast({
      title: "Competência Adicionada",
      description: `Competência "${values.name}" adicionada com sucesso.`,
    });
    form.reset();
  }

  const handleEditSkill = (updatedSkill: Skill) => {
    setSkills(prev =>
      prev.map(s => (s.id === updatedSkill.id ? updatedSkill : s))
    );
  };

  const handleDeleteSkill = (skillId: string) => {
    const skillName = skills.find(s => s.id === skillId)?.name;
    setSkills(prev => prev.filter(s => s.id !== skillId));
     toast({
      title: "Competência Excluída",
      description: `Competência "${skillName}" foi excluída com sucesso.`,
    });
  };

  const openEditDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (skill: Skill) => {
    setSelectedSkill(skill);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Gerenciar Competências</h1>
          <p className="text-muted-foreground">Adicione novas competências ou visualize as existentes.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Nova Competência</CardTitle>
                <CardDescription>Crie uma nova competência para seus colaboradores.</CardDescription>
              </CardHeader>
              <CardContent>
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
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      Adicionar Competência
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Competências Existentes</CardTitle>
                <CardDescription>Aqui estão todas as suas competências atuais.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {skills.map(skill => (
                      <TableRow key={skill.id}>
                        <TableCell className="font-medium">{skill.name}</TableCell>
                         <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(skill)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                           <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(skill)}>
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
      <EditSkillDialog
        skill={selectedSkill}
        onEditSkill={handleEditSkill}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      <DeleteSkillDialog
        skill={selectedSkill}
        onDeleteSkill={handleDeleteSkill}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </>
  );
}
