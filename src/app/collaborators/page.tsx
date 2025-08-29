import { AppLayout } from "@/components/layout/app-layout";
import { CollaboratorsClient } from "@/components/collaborators/collaborators-client";
import type { Collaborator } from "@/lib/types";

// In a real app, this data would come from a database
const mockCollaborators: Collaborator[] = [
    { id: '1', name: 'Ana Silva', role: 'Gerente', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026024d' },
    { id: '2', name: 'Carlos Oliveira', role: 'Diretor(a) Financeiro(a)', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { id: '3', name: 'Beatriz Costa', role: 'Trainee', avatarUrl: 'https://i.pravatar.cc/150?u=a04258114e29026702d' },
    { id: '4', name: 'Daniel Martins', role: 'Painter', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708c' },
];

export const availableRoles = [
  'Presidente(a)',
  'Diretor(a) Financeiro(a)',
  'Gerente',
  'Painter',
  'Tuner',
  'Trainee',
  'Aposentado'
];

export default function CollaboratorsPage() {
  const collaborators = mockCollaborators;

  return (
    <AppLayout>
      <CollaboratorsClient 
        initialCollaborators={collaborators}
        availableRoles={availableRoles}
      />
    </AppLayout>
  );
}
