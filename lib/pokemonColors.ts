export interface TypeColorConfig {
  bg: string;
  text: string;
  border: string;
  glow: string;
  badgeClass: string;
}

export const POKEMON_TYPE_COLORS: Record<string, TypeColorConfig> = {
  normal: {
    bg: "bg-stone-500/15 dark:bg-stone-500/25",
    text: "text-stone-700 dark:text-stone-300",
    border: "border-stone-500/30",
    glow: "rgba(168, 167, 122, 0.3)",
    badgeClass: "bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/30",
  },
  fire: {
    bg: "bg-orange-500/15 dark:bg-orange-500/25",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/30",
    glow: "rgba(238, 129, 48, 0.35)",
    badgeClass: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  },
  water: {
    bg: "bg-sky-500/15 dark:bg-sky-500/25",
    text: "text-sky-600 dark:text-sky-400",
    border: "border-sky-500/30",
    glow: "rgba(99, 144, 240, 0.35)",
    badgeClass: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
  },
  grass: {
    bg: "bg-emerald-500/15 dark:bg-emerald-500/25",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    glow: "rgba(122, 199, 76, 0.35)",
    badgeClass: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  },
  electric: {
    bg: "bg-amber-400/20 dark:bg-amber-400/25",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-400/40",
    glow: "rgba(247, 208, 44, 0.4)",
    badgeClass: "bg-amber-400/20 text-amber-600 dark:text-amber-400 border-amber-400/40",
  },
  ice: {
    bg: "bg-cyan-400/15 dark:bg-cyan-400/25",
    text: "text-cyan-600 dark:text-cyan-400",
    border: "border-cyan-400/30",
    glow: "rgba(150, 217, 214, 0.35)",
    badgeClass: "bg-cyan-400/15 text-cyan-600 dark:text-cyan-400 border-cyan-400/30",
  },
  fighting: {
    bg: "bg-red-700/15 dark:bg-red-700/25",
    text: "text-red-700 dark:text-red-400",
    border: "border-red-700/30",
    glow: "rgba(194, 46, 40, 0.35)",
    badgeClass: "bg-red-700/15 text-red-700 dark:text-red-400 border-red-700/30",
  },
  poison: {
    bg: "bg-purple-500/15 dark:bg-purple-500/25",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-500/30",
    glow: "rgba(163, 62, 161, 0.35)",
    badgeClass: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
  },
  ground: {
    bg: "bg-yellow-700/15 dark:bg-yellow-700/25",
    text: "text-yellow-700 dark:text-yellow-400",
    border: "border-yellow-700/30",
    glow: "rgba(226, 191, 101, 0.35)",
    badgeClass: "bg-yellow-700/15 text-yellow-700 dark:text-yellow-400 border-yellow-700/30",
  },
  flying: {
    bg: "bg-indigo-400/15 dark:bg-indigo-400/25",
    text: "text-indigo-600 dark:text-indigo-400",
    border: "border-indigo-400/30",
    glow: "rgba(169, 143, 243, 0.35)",
    badgeClass: "bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 border-indigo-400/30",
  },
  psychic: {
    bg: "bg-pink-500/15 dark:bg-pink-500/25",
    text: "text-pink-600 dark:text-pink-400",
    border: "border-pink-500/30",
    glow: "rgba(249, 85, 135, 0.35)",
    badgeClass: "bg-pink-500/15 text-pink-600 dark:text-pink-400 border-pink-500/30",
  },
  bug: {
    bg: "bg-lime-600/15 dark:bg-lime-600/25",
    text: "text-lime-700 dark:text-lime-400",
    border: "border-lime-600/30",
    glow: "rgba(166, 185, 26, 0.35)",
    badgeClass: "bg-lime-600/15 text-lime-700 dark:text-lime-400 border-lime-600/30",
  },
  rock: {
    bg: "bg-amber-800/15 dark:bg-amber-800/25",
    text: "text-amber-800 dark:text-amber-400",
    border: "border-amber-800/30",
    glow: "rgba(182, 161, 54, 0.35)",
    badgeClass: "bg-amber-800/15 text-amber-800 dark:text-amber-400 border-amber-800/30",
  },
  ghost: {
    bg: "bg-violet-700/15 dark:bg-violet-700/25",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-700/30",
    glow: "rgba(115, 87, 151, 0.35)",
    badgeClass: "bg-violet-700/15 text-violet-600 dark:text-violet-400 border-violet-700/30",
  },
  dragon: {
    bg: "bg-indigo-700/15 dark:bg-indigo-700/25",
    text: "text-indigo-700 dark:text-indigo-400",
    border: "border-indigo-700/30",
    glow: "rgba(111, 53, 252, 0.35)",
    badgeClass: "bg-indigo-700/15 text-indigo-700 dark:text-indigo-400 border-indigo-700/30",
  },
  steel: {
    bg: "bg-slate-400/15 dark:bg-slate-400/25",
    text: "text-slate-600 dark:text-slate-300",
    border: "border-slate-400/30",
    glow: "rgba(183, 183, 206, 0.35)",
    badgeClass: "bg-slate-400/15 text-slate-600 dark:text-slate-300 border-slate-400/30",
  },
  fairy: {
    bg: "bg-rose-400/15 dark:bg-rose-400/25",
    text: "text-rose-600 dark:text-rose-400",
    border: "border-rose-400/30",
    glow: "rgba(214, 133, 173, 0.35)",
    badgeClass: "bg-rose-400/15 text-rose-600 dark:text-rose-400 border-rose-400/30",
  },
};

export function getTypeConfig(type: string): TypeColorConfig {
  const normalized = type.toLowerCase();
  return (
    POKEMON_TYPE_COLORS[normalized] || {
      bg: "bg-muted",
      text: "text-muted-foreground",
      border: "border-border",
      glow: "rgba(0, 0, 0, 0.1)",
      badgeClass: "bg-muted text-muted-foreground border-border",
    }
  );
}

export const STAT_NAME_MAP: Record<string, string> = {
  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  "special-attack": "Sp. Atk",
  "special-defense": "Sp. Def",
  speed: "Speed",
};

export const STAT_COLOR_MAP: Record<string, string> = {
  hp: "bg-emerald-500",
  attack: "bg-orange-500",
  defense: "bg-amber-500",
  "special-attack": "bg-sky-500",
  "special-defense": "bg-indigo-500",
  speed: "bg-rose-500",
};
