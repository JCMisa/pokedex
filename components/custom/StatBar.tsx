"use client";

import * as React from "react";
import { STAT_COLOR_MAP, STAT_NAME_MAP } from "@/lib/pokemonColors";
import { cn } from "@/lib/utils";

interface StatBarProps {
  statName: string;
  value: number;
  max?: number;
}

export function StatBar({ statName, value, max = 200 }: StatBarProps) {
  const label = STAT_NAME_MAP[statName] || statName.toUpperCase();
  const percentage = Math.min(100, Math.round((value / max) * 100));
  const colorClass = STAT_COLOR_MAP[statName] || "bg-primary";

  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-16 font-medium text-muted-foreground uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="w-8 font-mono font-semibold text-foreground text-right shrink-0">
        {value}
      </span>
      <div className="relative h-2 w-full flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            colorClass
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
