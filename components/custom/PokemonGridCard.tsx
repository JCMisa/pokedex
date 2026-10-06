"use client";

import * as React from "react";
import Image from "next/image";
import { Check, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PokemonListItem } from "@/lib/types";
import { formatPokemonId, capitalize } from "@/lib/api";
import { getTypeConfig } from "@/lib/pokemonColors";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useCapturedStorage } from "@/hooks/useCapturedStorage";
import { cn } from "@/lib/utils";

interface PokemonGridCardProps {
  pokemon: PokemonListItem;
  isCaptured: boolean;
  onClick: () => void;
}

export function PokemonGridCard({
  pokemon,
  isCaptured,
  onClick,
}: PokemonGridCardProps) {
  const { data: detail, isLoading } = usePokemonDetail(pokemon.id);
  const { getCaptured } = useCapturedStorage();
  const capturedRecord = getCaptured(pokemon.id);

  // Stats (HP, Attack, Defense)
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
        "group relative flex flex-col justify-between p-4 sm:p-4.5 cursor-pointer overflow-hidden transition-all duration-300",
        "bg-card/80 dark:bg-card/60 backdrop-blur-md border-border/70 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 rounded-3xl",
        isCaptured &&
          "border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-xs",
      )}
    >
      {/* Top Header: ID & Gen */}
      <div className="w-full flex items-center justify-between z-10">
        <span className="font-mono text-xs font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors">
          {formatPokemonId(pokemon.id)}
        </span>
        <span className="font-mono text-[11px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
          GEN 1
        </span>
      </div>

      {/* Center Artwork with Ambient Glow */}
      <div className="relative my-2 sm:my-3 flex items-center justify-center w-full min-h-35 sm:min-h-40">
        {/* Background Blurred Artwork Glow (matching design mockup) */}
        <div
          className="absolute inset-0 size-36 sm:size-44 mx-auto opacity-35 dark:opacity-40 blur-xl pointer-events-none transition-all duration-500 group-hover:scale-125 group-hover:opacity-50"
          style={{
            backgroundImage: `url(${artworkUrl})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          }}
        />

        {/* Crisp Foreground Artwork */}
        <div className="relative z-10 size-32 sm:size-36 flex items-center justify-center">
          <Image
            src={artworkUrl}
            alt={pokemon.name}
            width={140}
            height={140}
            loading="lazy"
            className="object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-108"
          />
        </div>
      </div>

      {/* Identity: Name & Type Pills */}
      <div className="w-full z-10 space-y-1">
        <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors capitalize">
          {capitalize(pokemon.name)}
        </h3>

        {/* Type Badges */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
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
                    "h-5 px-2 py-0 text-[10px] font-bold uppercase tracking-wider rounded-full border shadow-2xs",
                    config.badgeClass,
                  )}
                >
                  {typeName}
                </Badge>
              );
            })
          )}
        </div>
      </div>

      {/* Base Stats Section (HP, ATK, DEF) */}
      <div className="w-full z-10 space-y-1.5 my-3">
        <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest block">
          STATS
        </span>

        {isLoading ? (
          <div className="space-y-1.5">
            <Skeleton className="h-2 w-full rounded" />
            <Skeleton className="h-2 w-full rounded" />
            <Skeleton className="h-2 w-full rounded" />
          </div>
        ) : (
          <div className="space-y-1 text-xs">
            {/* HP */}
            <div className="flex items-center gap-2">
              <span className="w-6 text-[10px] font-semibold text-muted-foreground">
                HP
              </span>
              <div className="flex-1 h-1.5 bg-muted/80 dark:bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 dark:bg-slate-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (hp / 150) * 100)}%` }}
                />
              </div>
              <span className="w-6 text-right font-mono text-[11px] font-bold text-foreground">
                {hp}
              </span>
            </div>

            {/* ATK */}
            <div className="flex items-center gap-2">
              <span className="w-6 text-[10px] font-semibold text-muted-foreground">
                ATK
              </span>
              <div className="flex-1 h-1.5 bg-muted/80 dark:bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 dark:bg-slate-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (atk / 150) * 100)}%` }}
                />
              </div>
              <span className="w-6 text-right font-mono text-[11px] font-bold text-foreground">
                {atk}
              </span>
            </div>

            {/* DEF */}
            <div className="flex items-center gap-2">
              <span className="w-6 text-[10px] font-semibold text-muted-foreground">
                DEF
              </span>
              <div className="flex-1 h-1.5 bg-muted/80 dark:bg-muted/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-400 dark:bg-slate-300 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (def / 150) * 100)}%` }}
                />
              </div>
              <span className="w-6 text-right font-mono text-[11px] font-bold text-foreground">
                {def}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer: Captured Pill Panel matching design */}
      <div className="w-full z-10 rounded-2xl bg-muted/40 dark:bg-black/30 border border-border/60 p-2.5 transition-colors group-hover:border-primary/30">
        <div className="flex items-center justify-between">
          {isCaptured ? (
            <Badge
              variant="outline"
              className="h-5.5 px-2 text-[11px] font-semibold gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full shadow-2xs"
            >
              <Check className="size-3" strokeWidth={3} />
              <span>Captured</span>
            </Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground/60 font-mono px-1">
              Uncaptured
            </span>
          )}

          <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </div>

        {isCaptured && capturedRecord && (
          <div className="text-[10px] text-muted-foreground mt-1 truncate">
            <span>
              Nickname:{" "}
              <strong className="text-foreground font-semibold">
                {capturedRecord.nickname || capitalize(pokemon.name)}
              </strong>
            </span>
            {" · "}
            <span>
              Date:{" "}
              <span className="font-mono">{capturedRecord.capturedDate}</span>
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
