"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  DEFAULT_PAGE_SIZE,
  fetchAllGen1Pokemon,
  fetchPokemonList,
} from "@/lib/api";

export function useInfinitePokemonList() {
  return useInfiniteQuery({
    queryKey: ["pokemon", "infinite"],
    queryFn: ({ pageParam = 0 }) =>
      fetchPokemonList({ limit: DEFAULT_PAGE_SIZE, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    staleTime: 1000 * 60 * 60, // 1 hr
  });
}

export function useAllGen1Pokemon() {
  return useQuery({
    queryKey: ["pokemon", "all-gen1"],
    queryFn: fetchAllGen1Pokemon,
    staleTime: 1000 * 60 * 60, // 1 hr
  });
}
