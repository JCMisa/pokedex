"use client";

import * as React from "react";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewMode } from "@/lib/types";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({
  viewMode,
  onViewModeChange,
}: ViewModeToggleProps) {
  return (
    <div className="inline-flex items-center p-1 bg-muted/70 rounded-lg border border-border/60 shadow-xs">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onViewModeChange("grid")}
            aria-label="Grid View"
            className={viewMode === "grid" ? "shadow-xs" : "text-muted-foreground hover:text-foreground"}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Grid view</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => onViewModeChange("list")}
            aria-label="List View"
            className={viewMode === "list" ? "shadow-xs" : "text-muted-foreground hover:text-foreground"}
          >
            <List className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>List view</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
