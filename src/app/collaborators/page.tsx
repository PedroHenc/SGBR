import { AppLayout } from "@/components/layout/app-layout";
import { CollaboratorsClient } from "@/components/collaborators/collaborators-client";
import type { Collaborator } from "@/lib/types";

// In a real app, this data would come from a database
const mockCollaborators: Collaborator[] = [
    { id: '1', name: 'Ana Silva', role: 'Gerente' },
    { id: '2', name: 'Carlos Oliveira', role: 'Diretor(a) Financeiro(a)' },
    { id: '3', name: 'Beatriz Costa', role: 'Trainee' },
    { id: '4', name: 'Daniel Martins', role: 'Painter' },
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
