import {
  PokeAPIListResponse,
  PokemonDetail,
  PokemonListItem,
} from "./types";

export const GEN1_LIMIT = 151;
export const DEFAULT_PAGE_SIZE = 24;

export const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";

export function getPokemonIdFromUrl(url: string): number {
  const parts = url.split("/").filter(Boolean);
  const idStr = parts[parts.length - 1];
  return parseInt(idStr, 10) || 0;
}

export function getPokemonSpriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function getPokemonArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getPokemonCryUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`;
}

export function formatPokemonId(id: number): string {
  return `#${id.toString().padStart(3, "0")}`;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Fetch paginated list of Pokemon.
 * Automatically caps at Gen 1 (151).
 */
export async function fetchPokemonList({
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
}): Promise<{
  items: PokemonListItem[];
  total: number;
  nextOffset: number | null;
}> {
  // Ensure we do not fetch past Gen 1
  const effectiveOffset = Math.min(offset, GEN1_LIMIT);
  const remaining = Math.max(0, GEN1_LIMIT - effectiveOffset);
  const effectiveLimit = Math.min(limit, remaining);

  if (effectiveLimit <= 0) {
    return { items: [], total: GEN1_LIMIT, nextOffset: null };
  }

  const res = await fetch(
    `${POKEAPI_BASE_URL}/pokemon?limit=${effectiveLimit}&offset=${effectiveOffset}`
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Pokemon list: ${res.statusText}`);
  }

  const data: PokeAPIListResponse = await res.json();

  const items: PokemonListItem[] = data.results
    .map((item) => {
      const id = getPokemonIdFromUrl(item.url);
      return {
        id,
        name: item.name,
        url: item.url,
        spriteUrl: getPokemonSpriteUrl(id),
        artworkUrl: getPokemonArtworkUrl(id),
      };
    })
    .filter((item) => item.id <= GEN1_LIMIT);

  const nextOffset =
    effectiveOffset + effectiveLimit < GEN1_LIMIT
      ? effectiveOffset + effectiveLimit
      : null;

  return {
    items,
    total: GEN1_LIMIT,
    nextOffset,
  };
}

/**
 * Fetch all 151 Gen 1 Pokemon for client-side search and instant lookup.
 */
export async function fetchAllGen1Pokemon(): Promise<PokemonListItem[]> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon?limit=151&offset=0`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Gen 1 catalog: ${res.statusText}`);
  }

  const data: PokeAPIListResponse = await res.json();
  return data.results.map((item) => {
    const id = getPokemonIdFromUrl(item.url);
    return {
      id,
      name: item.name,
      url: item.url,
      spriteUrl: getPokemonSpriteUrl(id),
      artworkUrl: getPokemonArtworkUrl(id),
    };
  });
}

/**
 * Fetch detailed stats, types, abilities, and sprites for a specific Pokemon.
 */
export async function fetchPokemonDetail(
  idOrName: string | number
): Promise<PokemonDetail> {
  const res = await fetch(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch details for Pokemon ${idOrName}`);
  }
  return res.json();
}
