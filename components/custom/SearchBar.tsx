"use client";

import { SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search Pokémon by name or # (e.g., Pikachu or 25)...",
  resultCount,
  totalCount,
}: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3 z-10 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-9 pr-9 h-10 bg-background/80 backdrop-blur-xs rounded-xl border-border/70 focus-visible:ring-primary/40 focus-visible:border-primary text-sm shadow-xs transition-all"
        />
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onChange("")}
            className="absolute right-2.5 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </Button>
        )}
      </div>

      {value.trim() &&
        resultCount !== undefined &&
        totalCount !== undefined && (
          <div className="absolute -bottom-5 left-1 text-[11px] text-muted-foreground font-medium">
            Found {resultCount} of {totalCount} Pokémon
          </div>
        )}
    </div>
  );
}
