"use client";

import * as React from "react";
import Image from "next/image";
import {
  Volume2,
  Calendar as CalendarIcon,
  Tag,
  CheckCircle2,
  Sparkles,
  Weight,
  Ruler,
  Shield,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { StatBar } from "./StatBar";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import { useCapturedStorage } from "@/hooks/useCapturedStorage";
import { formatPokemonId, capitalize, getPokemonCryUrl } from "@/lib/api";
import { getTypeConfig } from "@/lib/pokemonColors";
import { showConfetti, cn } from "@/lib/utils";

interface PokemonDetailModalProps {
  pokemonId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

// Date formatting helpers
function formatDateToMMDDYYYY(date: Date): string {
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function parseDateString(dateStr: string): Date {
  const parts = dateStr.split("/");
  if (parts.length === 3) {
    const mm = parseInt(parts[0], 10) - 1;
    const dd = parseInt(parts[1], 10);
    const yyyy = parseInt(parts[2], 10);
    const parsed = new Date(yyyy, mm, dd);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  const fallback = new Date(dateStr);
  return !isNaN(fallback.getTime()) ? fallback : new Date();
}

/**
 * Inner content component keyed by `pokemonId`.
 * This allows state (nickname, selectedDate) to reset automatically on mount
 * without triggering cascading renders via useEffect.
 */
function PokemonDetailContent({
  pokemonId,
  onClose,
}: {
  pokemonId: number;
  onClose: () => void;
}) {
  const { data: detail, isLoading, isError } = usePokemonDetail(pokemonId);
  const { isCaptured, getCaptured, tagAsCaptured, removeCaptured } =
    useCapturedStorage();

  const capturedRecord = getCaptured(pokemonId);
  const currentlyCaptured = isCaptured(pokemonId);

  const [nickname, setNickname] = React.useState(
    () => capturedRecord?.nickname || "",
  );
  const [selectedDate, setSelectedDate] = React.useState<Date>(() => {
    if (capturedRecord?.capturedDate) {
      return parseDateString(capturedRecord.capturedDate);
    }
    return new Date();
  });
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);
  const [isReleaseAlertOpen, setIsReleaseAlertOpen] = React.useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  const handlePlayCry = () => {
    try {
      setIsPlayingAudio(true);
      const audio = new Audio(getPokemonCryUrl(pokemonId));
      audio.volume = 0.5;
      audio.play().catch(() => {});
      audio.onended = () => setIsPlayingAudio(false);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  const handleSaveCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail) return;

    const trimmedNickname = nickname.trim() || capitalize(detail.name);
    const trimmedDate = formatDateToMMDDYYYY(selectedDate);

    const officialArtwork =
      detail.sprites.other?.["official-artwork"]?.front_default ||
      detail.sprites.front_default ||
      "";

    tagAsCaptured({
      id: detail.id,
      name: detail.name,
      nickname: trimmedNickname,
      capturedDate: trimmedDate,
      spriteUrl: detail.sprites.front_default || "",
      artworkUrl: officialArtwork,
      types: detail.types.map((t) => t.type.name),
    });

    showConfetti();
    toast.success(
      currentlyCaptured
        ? `Updated ${capitalize(detail.name)}'s capture entry!`
        : `Caught ${capitalize(detail.name)}! Added to your collection. 🎉`,
      {
        description: `Nickname: "${trimmedNickname}" • Date: ${trimmedDate}`,
      },
    );
  };

  const handleRelease = () => {
    if (!detail) return;
    removeCaptured(detail.id);
    toast.info(`Released ${capitalize(detail.name)} back into the wild.`, {
      description: "Removed from your captured collection.",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3 mx-auto" />
        <Skeleton className="h-44 w-44 rounded-full mx-auto" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError || !detail) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Could not load details for this Pokémon.</p>
        <Button variant="outline" size="sm" onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Header / Banner */}
      <div className="relative p-6 pb-2 text-center bg-linear-to-b from-primary/15 via-primary/5 to-transparent border-b border-border/40">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-muted-foreground mb-2">
          <span>{formatPokemonId(detail.id)}</span>
          <span className="flex items-center gap-1">
            {currentlyCaptured ? (
              <span className="inline-flex items-center gap-1 text-primary font-semibold">
                <CheckCircle2 className="size-3.5" /> Captured
              </span>
            ) : (
              <span className="text-muted-foreground/70">Uncaptured</span>
            )}
          </span>
        </div>

        {/* High-res Artwork with ambient glow */}
        <div className="relative my-2 size-48 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
          <Image
            src={
              detail.sprites.other?.["official-artwork"]?.front_default ||
              detail.sprites.front_default ||
              ""
            }
            alt={detail.name}
            width={180}
            height={180}
            priority
            className="object-contain drop-shadow-xl relative z-10 hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex items-center justify-center gap-2 mt-2">
          <DialogTitle className="text-2xl font-black tracking-tight capitalize text-foreground">
            {capitalize(detail.name)}
          </DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handlePlayCry}
            disabled={isPlayingAudio}
            title="Play Pokémon Cry"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
          >
            <Volume2
              className={cn(
                "size-4",
                isPlayingAudio && "animate-pulse text-primary",
              )}
            />
          </Button>
        </div>

        {/* Type Pills */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {detail.types.map((typeEntry) => {
            const typeName = typeEntry.type.name;
            const config = getTypeConfig(typeName);
            return (
              <Badge
                key={typeName}
                variant="outline"
                className={cn(
                  "capitalize px-2.5 py-0.5 text-xs font-semibold rounded-full border shadow-2xs",
                  config.badgeClass,
                )}
              >
                {typeName}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-6 space-y-6">
        {/* Quick Info Grid: Height, Weight, Abilities */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-xl border border-border/60 text-center text-xs">
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Ruler className="size-3" /> Height
            </span>
            <span className="font-semibold text-foreground mt-0.5">
              {(detail.height / 10).toFixed(1)} m
            </span>
          </div>
          <div className="flex flex-col items-center border-x border-border/60">
            <span className="text-muted-foreground flex items-center gap-1">
              <Weight className="size-3" /> Weight
            </span>
            <span className="font-semibold text-foreground mt-0.5">
              {(detail.weight / 10).toFixed(1)} kg
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-muted-foreground flex items-center gap-1">
              <Shield className="size-3" /> Abilities
            </span>
            <span className="font-semibold text-foreground capitalize mt-0.5 truncate max-w-25">
              {detail.abilities.map((a) => a.ability.name).join(", ")}
            </span>
          </div>
        </div>

        {/* Base Stats Section */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Base Stats
          </h4>
          <div className="space-y-2 rounded-xl bg-muted/40 p-3.5 border border-border/50">
            {detail.stats.map((statEntry) => (
              <StatBar
                key={statEntry.stat.name}
                statName={statEntry.stat.name}
                value={statEntry.base_stat}
              />
            ))}
          </div>
        </div>

        {/* Capture Tracker Form (Exact Front End Exam Spec) */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">
                Tag as Captured
              </h4>
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              Status:{" "}
              <strong
                className={
                  currentlyCaptured ? "text-primary" : "text-muted-foreground"
                }
              >
                {currentlyCaptured ? "Captured" : "Not Captured"}
              </strong>
            </span>
          </div>

          <form onSubmit={handleSaveCapture} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Tag className="size-3.5 text-primary" />
                Enter Nickname:
              </label>
              <Input
                type="text"
                placeholder={`e.g., Sparks, ${capitalize(detail.name)}`}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="bg-background h-9 text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <CalendarIcon className="size-3.5 text-primary" />
                Capture Date (MM/DD/YYYY):
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9 bg-background border-input hover:bg-muted/50",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 size-3.5 text-muted-foreground" />
                    <span className="font-mono text-sm text-foreground">
                      {formatDateToMMDDYYYY(selectedDate)}
                    </span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                type="submit"
                className="flex-1 font-semibold shadow-xs"
                variant="default"
              >
                {currentlyCaptured ? "Update Capture Data" : "Tag as Captured"}
              </Button>

              {currentlyCaptured && (
                <>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => setIsReleaseAlertOpen(true)}
                    title="Release Pokémon"
                    className="shrink-0"
                  >
                    <Trash2 className="size-4" />
                  </Button>

                  <AlertDialog
                    open={isReleaseAlertOpen}
                    onOpenChange={setIsReleaseAlertOpen}
                  >
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Release{" "}
                          {nickname ? `"${nickname}"` : capitalize(detail.name)}
                          ?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to release{" "}
                          {capitalize(detail.name)}
                          {nickname ? ` (${nickname})` : ""} back into the wild?
                          This will remove it from your captured collection.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setIsReleaseAlertOpen(false)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            handleRelease();
                            setIsReleaseAlertOpen(false);
                          }}
                        >
                          Release Pokémon
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export function PokemonDetailModal({
  pokemonId,
  isOpen,
  onClose,
}: PokemonDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[90vw]! w-200! max-h-[90vh] overflow-y-auto p-0 gap-0 border-border/80 shadow-2xl rounded-2xl bg-card">
        {isOpen && pokemonId && (
          <PokemonDetailContent
            key={pokemonId}
            pokemonId={pokemonId}
            onClose={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
