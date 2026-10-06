"use client";

import { useMemo, useCallback, useSyncExternalStore } from "react";
import { CapturedPokemon } from "@/lib/types";

const STORAGE_KEY = "pokedex_captured_pokemon_v1";
const EVENT_KEY = "pokedex_captured_storage_change";

function getSnapshot(): string {
  if (typeof window === "undefined") return "[]";
  return localStorage.getItem(STORAGE_KEY) || "[]";
}

function getServerSnapshot(): string {
  return "[]";
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = () => callback();
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) callback();
  };

  window.addEventListener(EVENT_KEY, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(EVENT_KEY, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

const noopSubscribe = () => () => {};

export function useCapturedStorage() {
  // Pure hydration-safe mounted detection without cascading renders
  const isLoaded = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

  const rawJson = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  // Memoized so referential identity remains stable across renders
  const capturedList = useMemo<CapturedPokemon[]>(() => {
    try {
      return JSON.parse(rawJson);
    } catch (e) {
      console.log("captured list error: ", e);
      return [];
    }
  }, [rawJson]);

  const saveToStorage = useCallback((list: CapturedPokemon[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(EVENT_KEY));
  }, []);

  const tagAsCaptured = useCallback(
    (pokemon: CapturedPokemon) => {
      let currentList: CapturedPokemon[] = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        currentList = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.log("tags captured error: ", e);
        currentList = [];
      }

      // If already captured, update it, else prepend
      const existingIndex = currentList.findIndex(
        (item) => item.id === pokemon.id
      );
      let updated: CapturedPokemon[];
      if (existingIndex >= 0) {
        updated = [...currentList];
        updated[existingIndex] = pokemon;
      } else {
        updated = [pokemon, ...currentList];
      }

      saveToStorage(updated);
    },
    [saveToStorage]
  );

  const removeCaptured = useCallback(
    (id: number) => {
      let currentList: CapturedPokemon[] = [];
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        currentList = stored ? JSON.parse(stored) : [];
      } catch (e) {
        console.log("remove captured error: ", e);
        currentList = [];
      }

      const updated = currentList.filter((item) => item.id !== id);
      saveToStorage(updated);
    },
    [saveToStorage]
  );

  const isCaptured = useCallback(
    (id: number): boolean => {
      return capturedList.some((item) => item.id === id);
    },
    [capturedList]
  );

  const getCaptured = useCallback(
    (id: number): CapturedPokemon | undefined => {
      return capturedList.find((item) => item.id === id);
    },
    [capturedList]
  );

  return {
    capturedList,
    isCaptured,
    getCaptured,
    tagAsCaptured,
    removeCaptured,
    isLoaded,
  };
}
