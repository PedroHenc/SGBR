import { AppLayout } from "@/components/layout/app-layout";
import { SkillsClient } from "@/components/skills/skills-client";
import type { Skill } from "@/lib/types";

// In a real app, this data would come from a database
const mockSkills: Skill[] = [
  { id: '1', name: 'React' },
  { id: '2', name: 'Contabilidade' },
  { id: '3', name: 'Gestão de Projetos' },
  { id: '4', name: 'Comunicação' },
  { id: '5', name: 'Design Gráfico' },
];

export default function SkillsPage() {
  const skills = mockSkills;

  return (
    <AppLayout>
      <SkillsClient initialSkills={skills} />
    </AppLayout>
  );
}
