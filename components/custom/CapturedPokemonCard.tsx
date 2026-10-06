"use client";

import * as React from "react";
import Image from "next/image";
import {
  Trash2,
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CapturedPokemon, ViewMode } from "@/lib/types";
import { formatPokemonId, capitalize } from "@/lib/api";
import { getTypeConfig } from "@/lib/pokemonColors";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { cn } from "@/lib/utils";

interface CapturedPokemonCardProps {
  pokemon: CapturedPokemon;
  viewMode: ViewMode;
  onSelect: () => void;
  onRemove: () => void;
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

export function CapturedPokemonCard({
  pokemon,
  viewMode,
  onSelect,
  onRemove,
}: CapturedPokemonCardProps) {
  const { data: detail, isLoading } = usePokemonDetail(pokemon.id);
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const handleTrashClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAlertOpen(true);
  };

  const handleConfirmRemove = () => {
    onRemove();
    setIsAlertOpen(false);
  };

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

  const alertDialog = (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Release {pokemon.nickname ? `"${pokemon.nickname}"` : capitalize(pokemon.name)}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to release {capitalize(pokemon.name)}
            {pokemon.nickname ? ` (${pokemon.nickname})` : ""} back into the wild?
            This will remove it from your captured collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={(e) => {
              e.stopPropagation();
              setIsAlertOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleConfirmRemove();
            }}
          >
            Release Pokémon
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // ==================== LIST VIEW (Aligned with PokemonListCard) ====================
  if (viewMode === "list") {
    return (
      <>
        <Card
          onClick={onSelect}
          className={cn(
            "group relative overflow-hidden p-3 sm:p-3.5 px-4 sm:px-5 cursor-pointer transition-all duration-300",
            "bg-card/75 dark:bg-card/55 backdrop-blur-md border-border/70 hover:border-primary/50 hover:shadow-lg rounded-2xl",
            "border-primary/40 bg-primary/5 dark:bg-primary/6",
          )}
        >
          {/* Background Blurred Artwork Glow */}
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

            {/* Right Section: Divider + Captured Info + Release Button */}
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Vertical Divider Line */}
              <div className="hidden md:block h-12 w-px bg-border/60" />

              {/* Captured Information */}
              <div className="flex flex-col items-end text-right min-w-22.5">
                <Badge
                  variant="outline"
                  className="h-6 px-2.5 text-xs font-semibold gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full shadow-2xs"
                >
                  <Check className="size-3" strokeWidth={3} />
                  <span>Captured</span>
                </Badge>
                <div className="hidden sm:flex flex-col text-[11px] text-muted-foreground mt-1">
                  <span className="truncate max-w-30">
                    Nickname:{" "}
                    <strong className="text-foreground font-semibold">
                      {pokemon.nickname || "—"}
                    </strong>
                  </span>
                  <span className="text-[10px] text-muted-foreground/80">
                    Date: {pokemon.capturedDate}
                  </span>
                </div>
              </div>

              {/* Release Button with Confirmation Trigger */}
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleTrashClick}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Release Pokémon"
                aria-label={`Release ${pokemon.name}`}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>

          {/* Mobile-Only Secondary Row: Stats + Nickname & Date */}
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

            {/* Nickname on mobile */}
            <span className="text-[11px] truncate max-w-35">
              <span className="text-muted-foreground">Nick: </span>
              <strong className="text-primary font-semibold">
                {pokemon.nickname || "—"}
              </strong>
            </span>
          </div>
        </Card>
        {alertDialog}
      </>
    );
  }

  // ==================== GRID VIEW (Aligned with PokemonGridCard) ====================
  return (
    <>
      <Card
        onClick={onSelect}
        className={cn(
          "group relative flex flex-col justify-between p-4 sm:p-4.5 cursor-pointer overflow-hidden transition-all duration-300",
          "bg-card/80 dark:bg-card/60 backdrop-blur-md border-border/70 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1 rounded-3xl",
          "border-primary/40 bg-primary/5 dark:bg-primary/6 shadow-xs",
        )}
      >
        {/* Top Header: ID & Release Button */}
        <div className="w-full flex items-center justify-between z-10">
          <span className="font-mono text-xs font-semibold text-muted-foreground/80 group-hover:text-foreground transition-colors">
            {formatPokemonId(pokemon.id)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleTrashClick}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/15 rounded-md transition-colors"
            title="Release Pokémon"
            aria-label={`Release ${pokemon.name}`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

      {/* Center Artwork with Ambient Glow */}
      <div className="relative my-2 sm:my-3 flex items-center justify-center w-full min-h-35 sm:min-h-40">
        {/* Background Blurred Artwork Glow */}
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

      {/* Bottom Footer: Captured Pill Panel */}
      <div className="w-full z-10 rounded-2xl bg-muted/40 dark:bg-black/30 border border-border/60 p-2.5 transition-colors group-hover:border-primary/30">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="h-5.5 px-2 text-[11px] font-semibold gap-1 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-full shadow-2xs"
          >
            <Check className="size-3" strokeWidth={3} />
            <span>Captured</span>
          </Badge>

          <ChevronRight className="size-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
        </div>

        <div className="text-[10px] text-muted-foreground mt-1 truncate">
          <span>
            Nickname:{" "}
            <strong className="text-foreground font-semibold">
              {pokemon.nickname || capitalize(pokemon.name)}
            </strong>
          </span>
          {" · "}
          <span>
            Date: <span className="font-mono">{pokemon.capturedDate}</span>
          </span>
        </div>
      </div>
    </Card>
    {alertDialog}
  </>
  );
}
