import { AppLayout } from "@/components/layout/app-layout";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Transaction, Category, Appointment } from "@/lib/types";

// In a real app, this data would come from a database
const mockTransactions: Transaction[] = [
  { id: '1', type: 'revenue', description: 'Projeto de web design para Acme Corp', amount: 2500, date: new Date('2024-07-01'), categoryId: '1' },
  { id: '2', type: 'expense', description: 'Assinatura mensal da Adobe Creative Cloud', amount: 99, date: new Date('2024-07-03'), categoryId: '3' },
  { id: '3', type: 'revenue', description: 'Serviços de consultoria para Tech Solutions', amount: 1200, date: new Date('2024-07-10'), categoryId: '2' },
  { id: '4', type: 'expense', description: 'Material de escritório da Staples', amount: 150, date: new Date('2024-07-12'), categoryId: '4' },
  { id: '5', type: 'expense', description: 'Hospedagem Vercel para o site da empresa', amount: 75, date: new Date('2024-07-15'), categoryId: '3' },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Desenvolvimento Web', color: '#3b82f6' },
  { id: '2', name: 'Consultoria', color: '#16a34a' },
  { id: '3', name: 'Software', color: '#ea580c' },
  { id: '4', name: 'Material de Escritório', color: '#7c3aed' },
  { id: '5', name: 'Utilidades', color: '#db2777' },
  { id: '6', name: 'Marketing', color: '#f59e0b' },
];

const mockAppointments: Appointment[] = [
  { id: '1', title: 'Reunião com cliente Acme Corp', date: new Date('2024-07-15') },
  { id: '2', title: 'Prazo final do projeto para Tech Solutions', date: new Date('2024-07-22') },
  { id: '3', title: 'Sincronização da equipe: Planejamento Q3', date: new Date('2024-07-18') },
];

export default function DashboardPage() {
  const transactions = mockTransactions;
  const categories = mockCategories;
  const appointments = mockAppointments;

  return (
    <AppLayout>
      <DashboardClient
        initialTransactions={transactions}
        initialCategories={categories}
        initialAppointments={appointments}
      />
    </AppLayout>
  );
}
