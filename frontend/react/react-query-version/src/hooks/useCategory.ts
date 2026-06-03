import { categoryService } from "../services/categoryService";
import { useQuery } from "@tanstack/react-query";

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryService.fetchCategories(),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes. **Une mutation de catégorie invalidera cette cache, forçant une refetch à la prochaine utilisation du hook**.
  });
};
