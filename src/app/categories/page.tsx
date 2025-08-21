import { AppLayout } from "@/components/layout/app-layout";
import { CategoriesClient } from "@/components/categories/categories-client";
import type { Category } from "@/lib/types";

// In a real app, this data would come from a database
const mockCategories: Category[] = [
    { id: '1', name: 'Desenvolvimento Web' },
    { id: '2', name: 'Consultoria' },
    { id: '3', name: 'Software' },
    { id: '4', name: 'Material de Escritório' },
    { id: '5', name: 'Utilidades' },
    { id: '6', name: 'Marketing' },
];

export default function CategoriesPage() {
  const categories = mockCategories;

  return (
    <AppLayout>
      <CategoriesClient initialCategories={categories} />
    </AppLayout>
  );
}
