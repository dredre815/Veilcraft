"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ConversationTurn, Reading } from "@/lib/schema";
import type { QuestionContext } from "./use-reading-store";

type QuestionSnapshot = Pick<QuestionContext, "question" | "category" | "tone" | "language"> & {
  email?: string;
};

export interface ReadingArchiveEntry {
  seed: string;
  spreadId: string;
  question: QuestionSnapshot;
  reading: Reading;
  savedAt: number;
  conversation: readonly ConversationTurn[];
  feedback?: FeedbackSnapshot;
}

interface ReadingArchiveState {
  entries: readonly ReadingArchiveEntry[];
  saveReading: (entry: {
    seed: string;
    spreadId: string;
    question: QuestionSnapshot;
    reading: Reading;
  }) => void;
  appendConversation: (seed: string, turn: ConversationTurn) => void;
  resetConversation: (seed: string) => void;
  saveFeedback: (seed: string, feedback: FeedbackSnapshot) => void;
  clearHistory: () => void;
}

interface FeedbackSnapshot {
  score: number;
  tags: readonly string[];
  comment?: string;
  submittedAt: number;
}

const STORAGE_KEY = "veilcraft.reading.archive";

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useReadingArchive = create<ReadingArchiveState>()(
  persist(
    (set) => ({
      entries: [],
      saveReading: ({ seed, spreadId, question, reading }) => {
        const snapshot: QuestionSnapshot = {
          question: question.question.trim(),
          category: question.category,
          tone: question.tone,
          language: question.language,
          email: question.email,
        };
        set((state) => {
          const existingIndex = state.entries.findIndex((item) => item.seed === seed);
          if (existingIndex >= 0) {
            const updated = [...state.entries];
            const existing = updated[existingIndex];
            const merged: ReadingArchiveEntry = {
              seed,
              spreadId,
              question: snapshot,
              reading,
              savedAt: Date.now(),
              conversation: existing.conversation,
              feedback: existing.feedback,
            };
            updated.splice(existingIndex, 1, merged);
            return { entries: updated };
          }
          const entry: ReadingArchiveEntry = {
            seed,
            spreadId,
            question: snapshot,
            reading,
            savedAt: Date.now(),
            conversation: [],
          };
          return { entries: [entry, ...state.entries].slice(0, 50) };
        });
      },
      appendConversation: (seed, turn) => {
        set((state) => {
          const index = state.entries.findIndex((item) => item.seed === seed);
          if (index === -1) {
            return {};
          }
          const updated = [...state.entries];
          const entry = updated[index];
          updated.splice(index, 1, {
            ...entry,
            conversation: [...entry.conversation, turn],
          });
          return { entries: updated };
        });
      },
      resetConversation: (seed) => {
        set((state) => {
          const index = state.entries.findIndex((item) => item.seed === seed);
          if (index === -1) {
            return {};
          }
          const updated = [...state.entries];
          const entry = updated[index];
          updated.splice(index, 1, {
            ...entry,
            conversation: [],
          });
          return { entries: updated };
        });
      },
      saveFeedback: (seed, feedback) => {
        set((state) => {
          const index = state.entries.findIndex((item) => item.seed === seed);
          if (index === -1) {
            return {};
          }
          const updated = [...state.entries];
          const entry = updated[index];
          updated.splice(index, 1, {
            ...entry,
            feedback,
          });
          return { entries: updated };
        });
      },
      clearHistory: () => {
        set(() => ({ entries: [] }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return noopStorage;
        }
        return window.localStorage;
      }),
      partialize: (state) => ({ entries: state.entries }),
      version: 1,
    },
  ),
);
