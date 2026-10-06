export interface PokemonListItem {
  id: number;
  name: string;
  url: string;
  spriteUrl: string;
  artworkUrl: string;
  types?: string[];
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonTypeEntry {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStatEntry {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonAbilityEntry {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonSprites {
  front_default: string | null;
  front_shiny: string | null;
  back_default: string | null;
  other?: {
    "official-artwork"?: {
      front_default: string | null;
      front_shiny: string | null;
    };
    home?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonTypeEntry[];
  stats: PokemonStatEntry[];
  abilities: PokemonAbilityEntry[];
  sprites: PokemonSprites;
  cries?: {
    latest?: string;
    legacy?: string;
  };
}

export interface PokeAPIListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{
    name: string;
    url: string;
  }>;
}

export interface CapturedPokemon {
  id: number;
  name: string;
  nickname: string;
  capturedDate: string; // Formatted as YYYY-MM-DD or MM/DD/YYYY
  spriteUrl: string;
  artworkUrl: string;
  types: string[];
}

export type ViewMode = "grid" | "list";
export type TabMode = "all" | "captured";
