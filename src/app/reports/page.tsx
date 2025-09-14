import { AppLayout } from "@/components/layout/app-layout";
import { ReportsClient } from "@/components/reports/reports-client";
import type { Category, Collaborator, Transaction } from "@/lib/types";
import { getBenneiro, getRelatorios } from "@/services/sgbr-api";
import type { benneiro, Relatorios as RelatoriosType } from "@/services/types";

const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

const availableRoles = [
  "Presidente",
  "Gerencia",
  "Painter",
  "Tuner",
  "Trainee",
  "Aposentado",
];

export default async function ReportsPage() {
  let categories: Category[] = [];
  let transactions: (Omit<Transaction, "date"> & { date: string })[] = [];
  let collaborators: Collaborator[] = [];

  try {
    const [benneiroData, relatoriosData] = await Promise.all([
      getBenneiro(),
      getRelatorios(),
    ]);

    if (benneiroData?.data) {
      collaborators = benneiroData.data
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
        });
    }

    if (relatoriosData?.data) {
      const uniqueCategories = [
        ...new Set(
          relatoriosData.data
            .map((r) => r.categoria)
            .filter(Boolean) as string[],
        ),
      ];

      categories = uniqueCategories.map((name, index) => ({
        id: String(index + 1),
        name,
        color: generateRandomColor(),
      }));

      transactions = relatoriosData.data.map((r: RelatoriosType) => ({
        id: String(r.id),
        type: (r.lucro ?? 0) >= 0 ? "revenue" : "expense",
        description:
          `Serviço para ${r.cliente} no veículo ${r.veiculo}` ||
          "Relatório sem descrição",
        amount: Math.abs(r.lucro ?? 0),
        date: (r.created_at
          ? new Date(r.created_at)
          : new Date()).toISOString(),
        categoryId:
          categories.find((c) => c.name === r.categoria)?.id ||
          categories[0]?.id ||
          "1",
        collaboratorId: String(r.beneiro_id),
      }));
    }
  } catch (error) {
    console.warn("Could not fetch data. Is the API running?", error);
    categories = [];
    transactions = [];
    collaborators = [];
  }

  return (
    <AppLayout>
      <ReportsClient
        initialTransactions={transactions}
        initialCategories={categories}
        initialCollaborators={collaborators}
      />
    </AppLayout>
  );
}
