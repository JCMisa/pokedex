"use client";

import * as React from "react";
import Image from "next/image";
import {
  Check,
  ChevronRight,
  Flame,
  Droplets,
  Leaf,
  Zap,
  Snowflake,
  Sparkles,
  Skull,
  Bug,
  Eye,
  Ghost,
  Shield,
  Swords,
  Mountain,
  Feather,
  CircleDot,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PokemonListItem } from "@/lib/types";
import { formatPokemonId, capitalize } from "@/lib/api";
import { getTypeConfig } from "@/lib/pokemonColors";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useCapturedStorage } from "@/hooks/useCapturedStorage";
import { cn } from "@/lib/utils";

interface PokemonListCardProps {
  pokemon: PokemonListItem;
  isCaptured: boolean;
  onClick: () => void;
}

// Icon helper for Pokemon types
function getTypeIcon(typeName: string) {
  const size = "size-3 shrink-0";
  switch (typeName.toLowerCase()) {
    case "grass":
      return <Leaf className={size} />;
    case "poison":
      return <Skull className={size} />;
    case "fire":
      return <Flame className={size} />;
    case "water":
      return <Droplets className={size} />;
    case "electric":
      return <Zap className={size} />;
    case "ice":
      return <Snowflake className={size} />;
    case "fairy":
      return <Sparkles className={size} />;
    case "bug":
      return <Bug className={size} />;
    case "psychic":
      return <Eye className={size} />;
    case "ghost":
      return <Ghost className={size} />;
    case "fighting":
      return <Swords className={size} />;
    case "steel":
      return <Shield className={size} />;
    case "ground":
    case "rock":
      return <Mountain className={size} />;
    case "flying":
      return <Feather className={size} />;
    default:
      return <CircleDot className={size} />;
  }
}

export function PokemonListCard({
  pokemon,
  isCaptured,
  onClick,
}: PokemonListCardProps) {
  const { data: detail, isLoading } = usePokemonDetail(pokemon.id);
  const { getCaptured } = useCapturedStorage();
  const capturedRecord = getCaptured(pokemon.id);

  // Extract base stats (HP, Attack, Defense)
  const hp = detail?.stats.find((s) => s.stat.name === "hp")?.base_stat ?? 0;
  const atk =
    detail?.stats.find((s) => s.stat.name === "attack")?.base_stat ?? 0;
  const def =
    detail?.stats.find((s) => s.stat.name === "defense")?.base_stat ?? 0;

  const artworkUrl =
    detail?.sprites.other?.["official-artwork"]?.front_default ||
    pokemon.artworkUrl ||
    pokemon.spriteUrl;

  const types = detail?.types.map((t) => t.type.name) ?? pokemon.types ?? [];

  return (
    <Card
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden p-3 sm:p-3.5 px-4 sm:px-5 cursor-pointer transition-all duration-300",
        "bg-card/75 dark:bg-card/55 backdrop-blur-md border-border/70 hover:border-primary/50 hover:shadow-lg rounded-2xl",
        isCaptured && "border-primary/40 bg-primary/5 dark:bg-primary/10",
      )}
    >
      {/* Background Blurred Artwork Glow (matching design mockup) */}
      <div
        className="absolute right-12 md:right-1/4 top-1/2 -translate-y-1/2 size-48 opacity-15 dark:opacity-30 blur-md pointer-events-none transition-all duration-500 group-hover:scale-115 group-hover:opacity-35"
        style={{
          backgroundImage: `url(${artworkUrl})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />

      {/* Main Row */}
      <div className="relative z-10 flex items-center justify-between gap-3 sm:gap-6">
        {/* Left Section: Avatar + ID + Name + Types */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Avatar Box */}
          <div className="relative size-14 sm:size-16 shrink-0 flex items-center justify-center rounded-xl bg-muted/60 dark:bg-muted/40 p-1 border border-border/60 shadow-2xs group-hover:border-primary/40 transition-colors">
            <Image
              src={artworkUrl}
              alt={pokemon.name}
              width={56}
              height={56}
              loading="lazy"
              className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors">
              {formatPokemonId(pokemon.id)}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors capitalize truncate">
              {capitalize(pokemon.name)}
            </h3>

            {/* Type Badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {isLoading && types.length === 0 ? (
                <>
                  <Skeleton className="h-4.5 w-14 rounded-full" />
                  <Skeleton className="h-4.5 w-14 rounded-full" />
                </>
              ) : (
                types.map((typeName) => {
                  const config = getTypeConfig(typeName);
                  return (
                    <Badge
                      key={typeName}
                      variant="outline"
                      className={cn(
                        "h-5 px-2 py-0 text-[10px] font-semibold uppercase tracking-wider gap-1 rounded-full border shadow-2xs",
                        config.badgeClass,
                      )}
                    >
                      {getTypeIcon(typeName)}
                      <span>{typeName}</span>
                    </Badge>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Center Section: STATS (HP, ATK, DEF) - Displayed on tablet and desktop */}
        <div className="hidden md:flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest mb-1.5 self-start">
            STATS
          </span>

          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
            </div>
          ) : (
            <div className="flex items-center gap-4 sm:gap-6">
              {/* HP */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-muted-foreground font-semibold text-[11px]">
                    HP
                  </span>
                  <span className="font-bold text-foreground font-mono text-[12px]">
                    {hp}
                  </span>
                </div>
                <div className="h-1.5 w-12 bg-muted/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (hp / 150) * 100)}%` }}
                  />
                </div>
              </div>

              {/* ATK */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-muted-foreground font-semibold text-[11px]">
                    ATK
                  </span>
                  <span className="font-bold text-foreground font-mono text-[12px]">
                    {atk}
                  </span>
                </div>
                <div className="h-1.5 w-12 bg-muted/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (atk / 150) * 100)}%` }}
                  />
                </div>
              </div>

              {/* DEF */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs gap-2">
                  <span className="text-muted-foreground font-semibold text-[11px]">
                    DEF
                  </span>
                  <span className="font-bold text-foreground font-mono text-[12px]">
                    {def}
                  </span>
                </div>
                <div className="h-1.5 w-12 bg-muted/80 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (def / 150) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Divider + Captured Info + Chevron */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Vertical Divider Line */}
          <div className="hidden md:block h-12 w-px bg-border/60" />

          {/* Captured Information */}
          <div className="flex flex-col items-end text-right min-w-22.5">
            {isCaptured ? (
              <>
                <Badge
                  variant="outline"
                  className="h-6 px-2.5 text-xs font-semibold gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full shadow-2xs"
                >
                  <Check className="size-3" strokeWidth={3} />
                  <span>Captured</span>
                </Badge>
                {capturedRecord && (
                  <div className="hidden sm:flex flex-col text-[11px] text-muted-foreground mt-1">
                    <span className="truncate max-w-27.5">
                      Nickname:{" "}
                      <strong className="text-foreground font-semibold">
                        {capturedRecord.nickname || "—"}
                      </strong>
                    </span>
                    <span className="text-[10px] text-muted-foreground/80">
                      Date: {capturedRecord.capturedDate}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground/50 font-mono hidden sm:inline">
                Uncaptured
              </span>
            )}
          </div>

          <ChevronRight className="size-4 sm:size-5 text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>

      {/* Mobile-Only Secondary Row: Stats + Nickname (Clean, compact, no overflow) */}
      <div className="md:hidden mt-2.5 pt-2 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
        {/* Compact Stats */}
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>
            HP <strong className="text-foreground">{hp}</strong>
          </span>
          <span>
            ATK <strong className="text-foreground">{atk}</strong>
          </span>
          <span>
            DEF <strong className="text-foreground">{def}</strong>
          </span>
        </div>

        {/* Nickname on mobile if captured */}
        {isCaptured && capturedRecord?.nickname && (
          <span className="text-[11px] truncate max-w-32.5">
            <span className="text-muted-foreground">Nick: </span>
            <strong className="text-primary font-semibold">
              {capturedRecord.nickname}
            </strong>
          </span>
        )}
      </div>
    </Card>
  );
}
