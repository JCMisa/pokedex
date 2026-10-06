"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Search,
  PackageOpen,
  ArrowDown,
} from "lucide-react";
import { Navbar } from "@/components/custom/Navbar";
import { SearchBar } from "@/components/custom/SearchBar";
import { ViewModeToggle } from "@/components/custom/ViewModeToggle";
import { PokemonGridCard } from "@/components/custom/PokemonGridCard";
import { PokemonListCard } from "@/components/custom/PokemonListCard";
import { CapturedPokemonCard } from "@/components/custom/CapturedPokemonCard";
import { PokemonDetailModal } from "@/components/custom/PokemonDetailModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useInfinitePokemonList,
  useAllGen1Pokemon,
} from "@/hooks/usePokemonList";
import { useCapturedStorage } from "@/hooks/useCapturedStorage";
import { PokemonListItem, ViewMode, TabMode } from "@/lib/types";
import { capitalize } from "@/lib/api";

export default function Home() {
  const [activeTab, setActiveTab] = React.useState<TabMode>("all");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedPokemonId, setSelectedPokemonId] = React.useState<
    number | null
  >(null);

  // TanStack Query for Paginated / Infinite list
  const {
    data: infiniteData,
    isLoading: isLoadingInfinite,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfinitePokemonList();

  // TanStack Query for Full Gen 1 (for 0-latency client-side search)
  const { data: allGen1List } = useAllGen1Pokemon();

  // LocalStorage state for captured Pokemon
  const {
    capturedList,
    isCaptured,
    removeCaptured,
    isLoaded: isCapturedLoaded,
  } = useCapturedStorage();

  // Flattened paginated items
  const paginatedPokemon: PokemonListItem[] = React.useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page.items);
  }, [infiniteData]);

  // Client-side search filtering across Gen 1
  const searchResults: PokemonListItem[] = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const source = allGen1List || paginatedPokemon;
    return source.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(query);
      const matchesId =
        pokemon.id.toString() === query || `#${pokemon.id}` === query;
      return matchesName || matchesId;
    });
  }, [searchQuery, allGen1List, paginatedPokemon]);

  // Captured Pokemon filtered by search
  const filteredCaptured = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return capturedList;

    return capturedList.filter((pokemon) => {
      const matchesName = pokemon.name.toLowerCase().includes(query);
      const matchesNickname = pokemon.nickname.toLowerCase().includes(query);
      const matchesId =
        pokemon.id.toString() === query || `#${pokemon.id}` === query;
      return matchesName || matchesNickname || matchesId;
    });
  }, [searchQuery, capturedList]);

  // Determine which list to display in "All" tab
  const isSearching = searchQuery.trim().length > 0;
  const displayedAllPokemon = isSearching ? searchResults : paginatedPokemon;

  // Intersection Observer for Infinite Scroll Bonus
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (isSearching || activeTab !== "all" || !hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" },
    );

    const target = sentinelRef.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [isSearching, activeTab, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRemoveCaptured = (id: number, name: string) => {
    removeCaptured(id);
    toast.info(`Released ${capitalize(name)} from your captured collection.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="container max-w-6xl mx-auto flex-1 px-4 sm:px-6 py-6 space-y-6">
        {/* Controls Bar: Navigation Tabs, Search, View Mode Toggle */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-border/50">
          {/* Tabs: All vs Captured */}
          <Tabs
            value={activeTab}
            onValueChange={(val) => {
              setActiveTab(val as TabMode);
              setSearchQuery("");
            }}
            className="w-full md:w-auto"
          >
            <TabsList className="grid grid-cols-2 h-10 w-full md:w-72 bg-muted/80 p-1 rounded-xl">
              <TabsTrigger
                value="all"
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs"
              >
                All Pokémon
              </TabsTrigger>
              <TabsTrigger
                value="captured"
                className="rounded-lg text-xs font-semibold data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="size-3.5 text-primary" />
                <span>Captured</span>
                {isCapturedLoaded && capturedList.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                    {capturedList.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Right Controls: Search & View Toggle */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder={
                activeTab === "all"
                  ? "Search Pokémon by name or #..."
                  : "Search captured Pokémon..."
              }
              resultCount={
                activeTab === "all"
                  ? isSearching
                    ? searchResults.length
                    : undefined
                  : filteredCaptured.length
              }
              totalCount={activeTab === "all" ? 151 : capturedList.length}
            />

            <ViewModeToggle
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Tab 1: All Pokemon View */}
        {activeTab === "all" && (
          <div className="space-y-6">
            {isLoadingInfinite && paginatedPokemon.length === 0 ? (
              // Loading Skeleton State
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
                    : "space-y-3 max-w-3xl mx-auto"
                }
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className={
                      viewMode === "grid"
                        ? "h-88 w-full rounded-3xl"
                        : "h-20 w-full rounded-xl"
                    }
                  />
                ))}
              </div>
            ) : displayedAllPokemon.length === 0 ? (
              // Empty Search Result State
              <div className="py-16 text-center space-y-3">
                <Search className="size-12 mx-auto text-muted-foreground/40" />
                <h3 className="text-lg font-semibold text-foreground">
                  No Pokémon Found
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  No Pokémon matched your search query &ldquo;{searchQuery}
                  &rdquo;. Try another name or number between 1 and 151.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              </div>
            ) : (
              // Render Grid or List View
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {displayedAllPokemon.map((pokemon) => (
                      <PokemonGridCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        isCaptured={isCaptured(pokemon.id)}
                        onClick={() => setSelectedPokemonId(pokemon.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-w-3xl mx-auto">
                    {displayedAllPokemon.map((pokemon) => (
                      <PokemonListCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        isCaptured={isCaptured(pokemon.id)}
                        onClick={() => setSelectedPokemonId(pokemon.id)}
                      />
                    ))}
                  </div>
                )}

                {/* Pagination & Infinite Scroll Controls (Spec & Bonus) */}
                {!isSearching && (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    {/* Sentinel target for infinite scrolling */}
                    <div ref={sentinelRef} className="h-1 w-full" />

                    {isFetchingNextPage ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        <span>Loading more Pokémon...</span>
                      </div>
                    ) : hasNextPage ? (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => fetchNextPage()}
                          className="px-6 rounded-xl font-semibold border-primary/30 hover:border-primary hover:bg-primary/10 gap-2"
                        >
                          <ArrowDown className="size-4" />
                          <span>Load More (Pagination)</span>
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {paginatedPokemon.length} of 151 Pokémon loaded
                          (Infinite scroll active)
                        </span>
                      </div>
                    ) : (
                      <div className="text-xs text-muted-foreground font-mono bg-muted/60 px-3 py-1.5 rounded-full border border-border/50">
                        🎉 All 151 Gen 1 Pokémon loaded!
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 2: Captured Pokemon View (Spec Requirements) */}
        {activeTab === "captured" && (
          <div className="space-y-6">
            {filteredCaptured.length === 0 ? (
              <div className="py-16 text-center space-y-4 max-w-md mx-auto">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto text-primary">
                  <PackageOpen className="size-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {isSearching
                      ? "No Captured Pokémon Found"
                      : "No Pokémon Captured Yet"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {isSearching
                      ? `No captured Pokémon match "${searchQuery}".`
                      : "Go to the All Pokémon tab, click on any Pokémon, and tag it as captured with a custom nickname and capture date!"}
                  </p>
                </div>
                {!isSearching && (
                  <Button
                    variant="default"
                    onClick={() => setActiveTab("all")}
                    className="font-semibold shadow-xs rounded-xl"
                  >
                    Explore Pokédex
                  </Button>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4 font-medium">
                  <span>
                    Showing {filteredCaptured.length} captured Pokémon
                  </span>
                  {/* <span>Stored in LocalStorage</span> */}
                </div>

                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                    {filteredCaptured.map((pokemon) => (
                      <CapturedPokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        viewMode="grid"
                        onSelect={() => setSelectedPokemonId(pokemon.id)}
                        onRemove={() =>
                          handleRemoveCaptured(pokemon.id, pokemon.name)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2.5 max-w-3xl mx-auto">
                    {filteredCaptured.map((pokemon) => (
                      <CapturedPokemonCard
                        key={pokemon.id}
                        pokemon={pokemon}
                        viewMode="list"
                        onSelect={() => setSelectedPokemonId(pokemon.id)}
                        onRemove={() =>
                          handleRemoveCaptured(pokemon.id, pokemon.name)
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Pokemon Detail Modal (Opens for any selected Pokemon) */}
      <PokemonDetailModal
        pokemonId={selectedPokemonId}
        isOpen={selectedPokemonId !== null}
        onClose={() => setSelectedPokemonId(null)}
      />
    </div>
  );
}
