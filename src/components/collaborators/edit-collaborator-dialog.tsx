"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, UploadCloud, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import type { Collaborator } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import useMutationBenneiro from "@/hooks/useMutationBenneiro";

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
  avatarUrl: z.string().optional(),
});

export function EditCollaboratorDialog(
  { collaborator, onEditCollaborator, open, onOpenChange, availableRoles }:
    EditCollaboratorDialogProps,
) {
  const { toast } = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { putBenneiro } = useMutationBenneiro();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (collaborator) {
      form.reset({
        name: collaborator.name,
        role: collaborator.role,
        avatarUrl: collaborator.avatarUrl,
      });
      setPreview(collaborator.avatarUrl || null);
    }
  }, [collaborator, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!collaborator) return;

    putBenneiro.mutate({
      id: Number(collaborator.id),
      nome: values.name,
      cargo: values.role,
      foto_perfil: preview || undefined,
    });

    toast({
      title: "Colaborador Atualizado",
      description: `"${values.name}" foi atualizado com sucesso.`,
    });
    onOpenChange(false);
  }

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
  };

  const title = "Editar Colaborador";
  const description = "Atualize os detalhes do colaborador.";

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
              <FormItem>
                <FormLabel>Foto do Colaborador</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={preview || undefined}
                        alt={collaborator.name}
                      />
                      <AvatarFallback>
                        <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label
                        htmlFor="picture"
                        className={cn(
                          "cursor-pointer",
                          buttonVariants({ variant: "outline" }),
                        )}
                      >
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Carregar Imagem
                      </Label>
                      <Input
                        id="picture"
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting ||
                    putBenneiro.isPending}
                >
                  {form.formState.isSubmitting ||
                    putBenneiro.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
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
