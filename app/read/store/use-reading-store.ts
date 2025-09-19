"use client";

import { create } from "zustand";

import { type DrawResult, type DrawnCard } from "@/lib/draw";
import { type ConversationTurn, type Reading } from "@/lib/schema";
import { spreads, type SpreadId } from "@/lib/spreads";

export type DrawPhase = "idle" | "shuffling" | "revealing" | "complete";

export interface QuestionContext {
  question: string;
  category: string;
  tone: string;
  language: string;
  email?: string;
  submittedAt: number;
}

interface ReadingStoreState {
  question: QuestionContext | null;
  spreadId: SpreadId;
  seed: string | null;
  cards: readonly DrawnCard[];
  revealIndex: number;
  phase: DrawPhase;
  lastDrawAt: number | null;
  reading: Reading | null;
  interpretStatus: "idle" | "loading" | "success" | "error";
  interpretError: string | null;
  lastInterpretAt: number | null;
  conversation: readonly ConversationTurn[];
  setQuestion: (context: Omit<QuestionContext, "submittedAt"> & { submittedAt?: number }) => void;
  setSpread: (spreadId: SpreadId) => void;
  beginDraw: (result: DrawResult) => void;
  completeShuffle: () => void;
  revealNext: () => void;
  revealPrevious: () => void;
  resetDraw: () => void;
  setInterpretationPending: () => void;
  setInterpretationSuccess: (reading: Reading) => void;
  setInterpretationError: (message: string) => void;
  resetInterpretation: () => void;
  appendConversationTurn: (turn: ConversationTurn) => void;
  resetConversation: () => void;
}

const DEFAULT_SPREAD_ID: SpreadId = spreads[0]?.id ?? "three-card";

export const useReadingStore = create<ReadingStoreState>((set) => ({
  question: null,
  spreadId: DEFAULT_SPREAD_ID,
  seed: null,
  cards: [],
  revealIndex: 0,
  phase: "idle",
  lastDrawAt: null,
  reading: null,
  interpretStatus: "idle",
  interpretError: null,
  lastInterpretAt: null,
  conversation: [],
  setQuestion: ({ submittedAt, ...context }) =>
    set(() => ({
      question: {
        ...context,
        submittedAt: submittedAt ?? Date.now(),
      },
    })),
  setSpread: (spreadId) =>
    set((state) => {
      if (state.spreadId === spreadId) {
        return {};
      }
      return {
        spreadId,
        cards: [],
        revealIndex: 0,
        phase: "idle",
        seed: null,
        lastDrawAt: null,
        reading: null,
        interpretStatus: "idle",
        interpretError: null,
        lastInterpretAt: null,
      };
    }),
  beginDraw: (result) =>
    set(() => ({
      seed: result.seed,
      cards: result.cards,
      revealIndex: 0,
      phase: "shuffling",
      lastDrawAt: Date.now(),
      reading: null,
      interpretStatus: "idle",
      interpretError: null,
      lastInterpretAt: null,
      conversation: [],
    })),
  completeShuffle: () =>
    set((state) => ({
      phase: state.cards.length > 0 ? "revealing" : "complete",
    })),
  revealNext: () =>
    set((state) => {
      if (state.cards.length === 0) {
        return {};
      }
      const nextIndex = Math.min(state.cards.length, state.revealIndex + 1);
      const phase = nextIndex >= state.cards.length ? "complete" : "revealing";
      if (nextIndex === state.revealIndex) {
        return {};
      }
      return {
        revealIndex: nextIndex,
        phase,
      };
    }),
  revealPrevious: () =>
    set((state) => {
      if (state.cards.length === 0) {
        return {};
      }
      const previousIndex = Math.max(0, state.revealIndex - 1);
      if (previousIndex === state.revealIndex) {
        return {};
      }
      return {
        revealIndex: previousIndex,
        phase: "revealing",
      };
    }),
  resetDraw: () =>
    set(() => ({
      cards: [],
      revealIndex: 0,
      phase: "idle",
      seed: null,
      lastDrawAt: null,
      reading: null,
      interpretStatus: "idle",
      interpretError: null,
      lastInterpretAt: null,
      conversation: [],
    })),
  setInterpretationPending: () =>
    set(() => ({
      interpretStatus: "loading",
      interpretError: null,
      reading: null,
      conversation: [],
    })),
  setInterpretationSuccess: (reading) =>
    set(() => ({
      reading,
      interpretStatus: "success",
      interpretError: null,
      lastInterpretAt: Date.now(),
      conversation: [],
    })),
  setInterpretationError: (message) =>
    set(() => ({
      interpretStatus: "error",
      interpretError: message,
      lastInterpretAt: Date.now(),
      conversation: [],
    })),
  resetInterpretation: () =>
    set(() => ({
      reading: null,
      interpretStatus: "idle",
      interpretError: null,
      lastInterpretAt: null,
      conversation: [],
    })),
  appendConversationTurn: (turn) =>
    set((state) => ({
      conversation: [...state.conversation, turn],
    })),
  resetConversation: () =>
    set(() => ({
      conversation: [],
    })),
}));
