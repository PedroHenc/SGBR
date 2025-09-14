import { AppLayout } from "@/components/layout/app-layout";
import { CategoriesClient } from "@/components/categories/categories-client";
import type { Category } from "@/lib/types";
import { getRelatorios } from "@/services/sgbr-api";

const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`;

export default async function CategoriesPage() {
  let categories: Category[] = [];

  try {
    const relatoriosData = await getRelatorios();
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
    }
  } catch (error) {
    console.warn("Could not fetch categories data. Is the API running?", error);
    categories = [];
  }

  return (
    <AppLayout>
      <CategoriesClient initialCategories={categories} />
    </AppLayout>
  );
}
