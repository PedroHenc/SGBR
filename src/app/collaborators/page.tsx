
"use client";

import { AppLayout } from "@/components/layout/app-layout";
import { CollaboratorsClient } from "@/components/collaborators/collaborators-client";
import type { Collaborator } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { getBenneiro } from "@/services/sgbr-api";
import type { benneiro } from "@/services/types";
import { Skeleton } from "@/components/ui/skeleton";

export const availableRoles = [
  'Presidente',
  'Gerencia',
  'Painter',
  'Tuner',

  'Trainee',
  'Aposentado'
];

export default function CollaboratorsPage() {

  const { data: benneiroData, isLoading } = useQuery({
    queryKey: ["benneiros"],
    queryFn: getBenneiro,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const collaborators: Collaborator[] = benneiroData?.data
    .map((b: benneiro) => ({
      id: String(b.id),
      name: b.nome,
      role: b.cargo,
      avatarUrl: `https://i.pravatar.cc/150?u=${b.id}`
    }))
    .sort((a, b) => {
      const roleAIndex = availableRoles.indexOf(a.role);
      const roleBIndex = availableRoles.indexOf(b.role);
      
      const effectiveRoleAIndex = roleAIndex === -1 ? Infinity : roleAIndex;
      const effectiveRoleBIndex = roleBIndex === -1 ? Infinity : roleBIndex;

      if (effectiveRoleAIndex < effectiveRoleBIndex) return -1;
      if (effectiveRoleAIndex > effectiveRoleBIndex) return 1;
      
      return Number(a.id) - Number(b.id);
    }) || [];

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gerenciar Colaboradores</h1>
            <p className="text-muted-foreground">Adicione novos colaboradores ou visualize a equipe existente.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-5">
            <div className="md:col-span-2">
              <Skeleton className="h-[500px] w-full" />
            </div>
            <div className="md:col-span-3">
              <Skeleton className="h-[500px] w-full" />
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <CollaboratorsClient
        initialCollaborators={collaborators}
        availableRoles={availableRoles}
      />
    </AppLayout>
  );
}
