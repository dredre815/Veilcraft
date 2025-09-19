"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type ApiKeyStatus = "unknown" | "valid" | "invalid";

interface OpenAiSettingsState {
  apiKey: string | null;
  apiKeyStatus: ApiKeyStatus;
  lastCheckedAt: number | null;
  setApiKey: (key: string) => void;
  clearApiKey: () => void;
  markApiKeyStatus: (status: ApiKeyStatus) => void;
}

const STORAGE_KEY = "veilcraft.openai.settings";

const noopStorage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
};

export const useOpenAiSettings = create<OpenAiSettingsState>()(
  persist(
    (set) => ({
      apiKey: null,
      apiKeyStatus: "unknown",
      lastCheckedAt: null,
      setApiKey: (key) =>
        set(() => ({
          apiKey: key,
          apiKeyStatus: "unknown",
          lastCheckedAt: Date.now(),
        })),
      clearApiKey: () =>
        set(() => ({
          apiKey: null,
          apiKeyStatus: "unknown",
          lastCheckedAt: Date.now(),
        })),
      markApiKeyStatus: (status) =>
        set(() => ({
          apiKeyStatus: status,
          lastCheckedAt: Date.now(),
        })),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return noopStorage;
        }
        return window.localStorage;
      }),
      partialize: (state) => ({
        apiKey: state.apiKey,
        apiKeyStatus: state.apiKeyStatus,
        lastCheckedAt: state.lastCheckedAt,
      }),
    },
  ),
);
