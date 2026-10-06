"use client";

import * as React from "react";
import Image from "next/image";
import { ThemeToggler } from "@/components/custom/ThemeToggler";
import { Badge } from "@/components/ui/badge";
import { useCapturedStorage } from "@/hooks/useCapturedStorage";
import { Sparkles } from "lucide-react";

export function Navbar() {
  const { capturedList, isLoaded } = useCapturedStorage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md transition-colors">
      <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Pokédex Logo"
              width={38}
              height={26}
              priority
              className="drop-shadow-xs w-9.5 h-6.5"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-foreground font-heading">
                POKÉDEX
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold uppercase tracking-wider">
                Gen 1
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground hidden sm:inline">
              Kanto Region • 151 Pokémon
            </span>
          </div>
        </div>

        {/* Right side: Capture Progress & Theme Toggler */}
        <div className="flex items-center gap-3">
          {isLoaded && (
            <Badge
              variant="outline"
              className="h-8 px-3 gap-1.5 rounded-full border-border/80 bg-muted/40 text-xs font-semibold"
            >
              <Sparkles className="size-3.5 text-primary" />
              <span>
                Captured:{" "}
                <strong className="text-primary font-bold">
                  {capturedList.length}
                </strong>
                <span className="text-muted-foreground"> / 151</span>
              </span>
            </Badge>
          )}

          <ThemeToggler />
        </div>
      </div>
    </header>
  );
}
