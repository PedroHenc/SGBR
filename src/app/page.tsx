import { AppLayout } from "@/components/layout/app-layout";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import type { Transaction, Category, Appointment } from "@/lib/types";

// In a real app, this data would come from a database
const mockTransactions: Transaction[] = [
  { id: '1', type: 'revenue', description: 'Web design project for Acme Corp', amount: 2500, date: new Date('2024-07-01'), categoryId: '1' },
  { id: '2', type: 'expense', description: 'Monthly Adobe Creative Cloud subscription', amount: 99, date: new Date('2024-07-03'), categoryId: '3' },
  { id: '3', type: 'revenue', description: 'Consulting services for Tech Solutions', amount: 1200, date: new Date('2024-07-10'), categoryId: '2' },
  { id: '4', type: 'expense', description: 'Office supplies from Staples', amount: 150, date: new Date('2024-07-12'), categoryId: '4' },
  { id: '5', type: 'expense', description: 'Vercel hosting for company website', amount: 75, date: new Date('2024-07-15'), categoryId: '3' },
];

const mockCategories: Category[] = [
  { id: '1', name: 'Web Development' },
  { id: '2', name: 'Consulting' },
  { id: '3', name: 'Software' },
  { id: '4', name: 'Office Supplies' },
  { id: '5', name: 'Utilities' },
  { id: '6', name: 'Marketing' },
];

const mockAppointments: Appointment[] = [
  { id: '1', title: 'Client Meeting with Acme Corp', date: new Date('2024-07-15') },
  { id: '2', title: 'Project Deadline for Tech Solutions', date: new Date('2024-07-22') },
  { id: '3', title: 'Team Sync: Q3 Planning', date: new Date('2024-07-18') },
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
