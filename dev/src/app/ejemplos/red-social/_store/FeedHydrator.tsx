"use client";

import { useEffect } from "react";
import { useFeedStore } from "./feed";

/** Dispara la rehidratación de likes/guardados/comentarios desde localStorage tras montar. */
export function FeedHydrator() {
  useEffect(() => {
    useFeedStore.persist.rehydrate();
  }, []);
  return null;
}
