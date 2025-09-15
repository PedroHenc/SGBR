"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import useMutationBenneiro from "@/hooks/useMutationBenneiro";
import type { Collaborator } from "@/lib/types";
import { cn, fileToBase64 } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus, Trash2, UploadCloud, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { DeleteCollaboratorDialog } from "./delete-collaborator-dialog";
import { EditCollaboratorDialog } from "./edit-collaborator-dialog";

interface CollaboratorsClientProps {
  initialCollaborators: Collaborator[];
  availableRoles: string[];
}

const ITEMS_PER_PAGE = 5;

const formSchema = z.object({
  name: z.string().min(2, {
    message: "O nome do colaborador deve ter pelo menos 2 caracteres.",
  }),
  role: z.string().min(1, {
    message: "Por favor, selecione um cargo.",
  }),
  avatarUrl: z.string().optional(),
});

export function CollaboratorsClient(
  { initialCollaborators, availableRoles }: CollaboratorsClientProps,
) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(
    initialCollaborators,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<
    Collaborator | null
  >(null);
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { postBenneiro, deleteBenneiro } = useMutationBenneiro();

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(collaborators.length / ITEMS_PER_PAGE);
  const paginatedCollaborators = collaborators.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      role: "",
      avatarUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const maxId = collaborators.length > 0
      ? Math.max(...collaborators.map((c) => Number(c.id)))
      : 0;
    const newId = maxId + 1;

    const newCollaborator: Collaborator = {
      id: newId.toString(),
      name: values.name,
      role: values.role,
      avatarUrl: preview || undefined,
    };

    setCollaborators((prev) => [newCollaborator, ...prev]);

    postBenneiro.mutate({
      nome: values.name,
      cargo: values.role,
      fotoPerfil: preview ? preview.split(",")[1] : null,
    });

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
    setCollaborators((prev) =>
      prev.map(
        (c) => (c.id === updatedCollaborator.id ? updatedCollaborator : c),
      )
    );
  };

  const handleDeleteCollaborator = (collaboratorId: string) => {
    const collaborator = collaborators.find((c) => c.id === collaboratorId);
    if (!collaborator) return;

    deleteBenneiro.mutate(
      Number(collaboratorId),
      {
        onSuccess: () => {
          setCollaborators((prev) =>
            prev.filter((c) => c.id !== collaboratorId)
          );
          toast({
            title: "Colaborador Excluído",
            description: `"${collaborator.name}" foi excluído com sucesso.`,
          });
        },
        onError: () => {
          toast({
            title: "Erro ao Excluir",
            description:
              `Não foi possível excluir o colaborador "${collaborator.name}".`,
            variant: "destructive",
          });
        },
      },
    );
  };

  const openEditDialog = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsDeleteDialogOpen(true);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64String = await fileToBase64(file);
        setPreview(base64String); // ✅ preview + banco como base64
      } catch (error) {
        console.error("Erro ao converter imagem:", error);
        toast({
          title: "Erro ao carregar imagem",
          description: "Não foi possível converter a imagem.",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Gerenciar Colaboradores
          </h1>
          <p className="text-muted-foreground">
            Adicione novos colaboradores ou visualize a equipe existente.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Novo Colaborador</CardTitle>
                <CardDescription>
                  Insira os dados do novo membro da equipe.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormItem>
                      <FormLabel>Foto do Colaborador</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-4">
                          <Avatar className="h-20 w-20">
                            <AvatarImage
                              src={preview || undefined}
                              alt="Avatar do novo colaborador"
                            />
                            <AvatarFallback>
                              <UploadCloud className="h-8 w-8 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label
                              htmlFor="picture-new"
                              className={cn(
                                "cursor-pointer",
                                buttonVariants({ variant: "outline" }),
                              )}
                            >
                              <UploadCloud className="mr-2 h-4 w-4" />
                              Carregar Imagem
                            </Label>
                            <Input
                              id="picture-new"
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                              accept="image/*"
                              ref={fileInputRef}
                            />
                            {preview && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleRemoveImage}
                                className="w-fit"
                              >
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
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um cargo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availableRoles.map((role) => (
                                <SelectItem key={role} value={role}>
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting ||
                        postBenneiro.isPending}
                    >
                      {form.formState.isSubmitting || postBenneiro.isPending
                        ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        : <Plus className="mr-2 h-4 w-4" />}
                      Adicionar Colaborador
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* tabela */}
          <div className="md:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Equipe</CardTitle>
                <CardDescription>
                  Aqui estão todos os colaboradores da sua empresa.
                </CardDescription>
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
                    {paginatedCollaborators.map((collaborator) => (
                      <TableRow key={collaborator.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage
                                src={collaborator.avatarUrl
                                  ? `data:image/png;base64,${collaborator.avatarUrl}`
                                  : undefined}
                                alt={collaborator.name}
                              />
                              <AvatarFallback>
                                {collaborator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {collaborator.name}
                          </div>
                        </TableCell>
                        <TableCell>{collaborator.role}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              openEditDialog(collaborator)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(collaborator)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              {totalPages > 1 && (
                <CardFooter>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                      >
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Próximo
                      </Button>
                    </div>
                  </div>
                </CardFooter>
              )}
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
