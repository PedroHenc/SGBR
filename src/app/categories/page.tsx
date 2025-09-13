import { AppLayout } from "@/components/layout/app-layout";
import { CategoriesClient } from "@/components/categories/categories-client";
import type { Category } from "@/lib/types";

// In a real app, this data would come from a database
const mockCategories: Category[] = [
  { id: "1", name: "Desenvolvimento Web", color: "#3b82f6" },
  { id: "2", name: "Consultoria", color: "#16a34a" },
  { id: "3", name: "Software", color: "#ea580c" },
  { id: "4", name: "Material de Escritório", color: "#7c3aed" },
  { id: "5", name: "Utilidades", color: "#db2777" },
  { id: "6", name: "Marketing", color: "#f59e0b" },
];

export default function CategoriesPage() {
  const categories = mockCategories;

  return (
    <AppLayout>
      <CategoriesClient initialCategories={categories} />
    </AppLayout>
  );
}
