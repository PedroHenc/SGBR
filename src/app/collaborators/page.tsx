import { AppLayout } from "@/components/layout/app-layout";
import { CollaboratorsClient } from "@/components/collaborators/collaborators-client";
import type { Collaborator, Skill } from "@/lib/types";

// In a real app, this data would come from a database
const mockCollaborators: Collaborator[] = [
    { id: '1', name: 'Ana Silva', role: 'Gerente', skills: ['1', '3'] },
    { id: '2', name: 'Carlos Oliveira', role: 'Diretor(a) Financeiro(a)', skills: ['2'] },
    { id: '3', name: 'Beatriz Costa', role: 'Trainee', skills: ['4'] },
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

const mockSkills: Skill[] = [
  { id: '1', name: 'React' },
  { id: '2', name: 'Contabilidade' },
  { id: '3', name: 'Gestão de Projetos' },
  { id: '4', name: 'Comunicação' },
  { id: '5', name: 'Design Gráfico' },
];


export default function CollaboratorsPage() {
  const collaborators = mockCollaborators;
  const skills = mockSkills;

  return (
    <AppLayout>
      <CollaboratorsClient 
        initialCollaborators={collaborators}
        availableRoles={availableRoles}
        availableSkills={skills}
      />
    </AppLayout>
  );
}
