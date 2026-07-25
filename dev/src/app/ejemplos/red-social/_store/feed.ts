"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface FeedComment {
  id: string;
  postId: string;
  author: string;
  text: string;
  at: number;
  likes: number;
  liked: boolean;
  parentId: string | null;
}

interface FeedState {
  liked: Record<string, boolean>;
  saved: Record<string, boolean>;
  comments: FeedComment[];
  pollVotes: Record<string, string[]>;
  toggleLike: (postId: string) => void;
  toggleSave: (postId: string) => void;
  addComment: (postId: string, text: string, parentId?: string | null) => void;
  likeComment: (id: string, liked: boolean) => void;
  vote: (postId: string, ids: string[]) => void;
}

function id() {
  return Math.random().toString(36).slice(2, 9);
}

const SEED_COMMENTS: FeedComment[] = [
  {
    id: "c1",
    postId: "p1",
    author: "Camila Ríos",
    text: "¡Quedaron hermosas! ¿Hacen envíos al interior?",
    at: Date.now() - 3600_000,
    likes: 4,
    liked: false,
    parentId: null,
  },
  {
    id: "c2",
    postId: "p1",
    author: "Estudio Aldama",
    text: "¡Gracias Camila! Sí, hacemos envíos a todo el país.",
    at: Date.now() - 3000_000,
    likes: 1,
    liked: false,
    parentId: "c1",
  },
];

/**
 * `skipHydration` evita el mismatch de SSR: el server siempre renderiza el
 * feed sin interacciones, y `FeedHydrator` dispara la lectura real de
 * localStorage recién en el cliente, después del primer render.
 */
export const useFeedStore = create<FeedState>()(
  persist(
    (set) => ({
      liked: {},
      saved: {},
      comments: SEED_COMMENTS,
      pollVotes: {},
      toggleLike: (postId) => set((s) => ({ liked: { ...s.liked, [postId]: !s.liked[postId] } })),
      toggleSave: (postId) => set((s) => ({ saved: { ...s.saved, [postId]: !s.saved[postId] } })),
      addComment: (postId, text, parentId = null) =>
        set((s) => ({
          comments: [
            ...s.comments,
            { id: id(), postId, author: "Vos", text, at: Date.now(), likes: 0, liked: false, parentId },
          ],
        })),
      likeComment: (commentId, liked) =>
        set((s) => ({
          comments: s.comments.map((c) =>
            c.id === commentId ? { ...c, liked, likes: c.likes + (liked ? 1 : -1) } : c
          ),
        })),
      vote: (postId, ids) => set((s) => ({ pollVotes: { ...s.pollVotes, [postId]: ids } })),
    }),
    {
      name: "ejemplos-red-social",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    }
  )
);

export function useCommentsFor(postId: string) {
  return useFeedStore((s) => s.comments.filter((c) => c.postId === postId));
}
