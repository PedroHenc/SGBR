import { AppLayout } from "@/components/layout/app-layout";
import { CollaboratorsClient } from "@/components/collaborators/collaborators-client";
import type { Collaborator } from "@/lib/types";

// In a real app, this data would come from a database
const mockCollaborators: Collaborator[] = [
    { id: '1', name: 'Ana Silva', role: 'Gerente de Vendas' },
    { id: '2', name: 'Carlos Oliveira', role: 'Desenvolvedor Frontend' },
    { id: '3', name: 'Beatriz Costa', role: 'Analista de Marketing' },
    { id: '4', name: 'Daniel Martins', role: 'Suporte Técnico' },
];

export default function CollaboratorsPage() {
  const collaborators = mockCollaborators;

  return (
    <AppLayout>
      <CollaboratorsClient initialCollaborators={collaborators} />
    </AppLayout>
  );
}
