"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPokemonDetail } from "@/lib/api";

export function usePokemonDetail(idOrName: string | number | null | undefined) {
  return useQuery({
    queryKey: ["pokemon", "detail", idOrName],
    queryFn: () => {
      if (!idOrName) throw new Error("Pokemon ID or Name is required");
      return fetchPokemonDetail(idOrName);
    },
    enabled: Boolean(idOrName),
    staleTime: 1000 * 60 * 60 * 24, // 24 hrs
  });
}
