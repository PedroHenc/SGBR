import { AppLayout } from "@/components/layout/app-layout";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Category, Collaborator, Transaction } from "@/lib/types";
import { getBenneiro } from "@/services/sgbr-api";
import type { benneiro } from "@/services/types";

// In a real app, this data would come from a database
const mockTransactions: Omit<Transaction, "date"> & { date: string }[] = [
  {
    id: "1",
    type: "revenue",
    description: "Projeto de web design para Acme Corp",
    amount: 2500,
    date: new Date("2024-07-01T00:00:00").toISOString(),
    categoryId: "1",
    collaboratorId: "1",
  },
  {
    id: "2",
    type: "expense",
    description: "Assinatura mensal da Adobe Creative Cloud",
    amount: 99,
    date: new Date("2024-07-03T00:00:00").toISOString(),
    categoryId: "3",
    collaboratorId: "2",
  },
  {
    id: "3",
    type: "revenue",
    description: "Serviços de consultoria para Tech Solutions",
    amount: 1200,
    date: new Date("2024-07-10T00:00:00").toISOString(),
    categoryId: "2",
    collaboratorId: "1",
  },
  {
    id: "4",
    type: "expense",
    description: "Material de escritório da Staples",
    amount: 150,
    date: new Date("2024-07-12T00:00:00").toISOString(),
    categoryId: "4",
    collaboratorId: "3",
  },
  {
    id: "5",
    type: "expense",
    description: "Hospedagem Vercel para o site da empresa",
    amount: 75,
    date: new Date("2024-07-15T00:00:00").toISOString(),
    categoryId: "3",
    collaboratorId: "4",
  },
];

const mockCategories: Category[] = [
  { id: "1", name: "Desenvolvimento Web", color: "#3b82f6" },
  { id: "2", name: "Consultoria", color: "#16a34a" },
  { id: "3", name: "Software", color: "#ea580c" },
  { id: "4", name: "Material de Escritório", color: "#7c3aed" },
  { id: "5", name: "Utilidades", color: "#db2777" },
  { id: "6", name: "Marketing", color: "#f59e0b" },
];

const availableRoles = [
  "Presidente",
  "Gerencia",
  "Painter",
  "Tuner",
  "Trainee",
  "Aposentado",
];

export default async function DashboardPage() {
  const transactions = mockTransactions;
  const categories = mockCategories;

  const benneiroData = await getBenneiro();

  const collaborators: Collaborator[] = benneiroData?.data
    .map((b: benneiro) => ({
      id: String(b.id),
      name: b.nome,
      role: b.cargo,
      avatarUrl: b.foto_perfil,
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

  return (
    <AppLayout>
      <DashboardClient
        initialTransactions={transactions}
        initialCategories={categories}
        initialCollaborators={collaborators}
      />
    </AppLayout>
  );
}
