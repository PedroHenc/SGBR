import { AppLayout } from "@/components/layout/app-layout";
import { CategoriesClient } from "@/components/categories/categories-client";
import type { Category } from "@/lib/types";
import { getRelatorios } from "@/services/sgbr-api";

const colorPalette = [
  "#1f77b4",
  "#ff7f0e",
  "#2ca02c",
  "#d62728",
  "#9467bd",
  "#8c564b",
  "#e377c2",
  "#7f7f7f",
  "#bcbd22",
  "#17becf",
];

const getConsistentColor = (categoryName: string) => {
  let hash = 0;
  for (let i = 0; i < categoryName.length; i++) {
    hash = categoryName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colorPalette.length;
  return colorPalette[index];
};

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
        color: getConsistentColor(name),
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
