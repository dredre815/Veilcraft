import { describe, expect, it, vi, afterEach } from "vitest";

import { createSeededRng, generateSeed, shuffleWithSeed } from "../rng";

const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("generateSeed", () => {
  it("encodes random bytes as base58 using crypto.getRandomValues when available", () => {
    const bytes = new Uint8Array([0, 0, 0, 0]);
    const cryptoObject = globalThis.crypto;
    if (!cryptoObject) {
      throw new Error("Crypto API not available in test environment");
    }

    const getRandomValues = vi.spyOn(cryptoObject, "getRandomValues").mockImplementation(((
      array: ArrayBufferView,
    ) => {
      if (array instanceof Uint8Array) {
        array.set(bytes.slice(0, array.length));
        return array;
      }
      throw new Error("Unexpected typed array passed to getRandomValues");
    }) as typeof cryptoObject.getRandomValues);

    const seed = generateSeed(bytes.length);

    expect(seed).toBe("11111");
    expect(seed.split("").every((char) => BASE58_ALPHABET.includes(char))).toBe(true);
    expect(getRandomValues).toHaveBeenCalledTimes(1);
  });
});

describe("createSeededRng", () => {
  it("returns a deterministic pseudo random sequence for the same seed", () => {
    const rngA = createSeededRng("veilcraft-seed");
    const rngB = createSeededRng("veilcraft-seed");

    const sequenceA = Array.from({ length: 5 }, () => rngA());
    const sequenceB = Array.from({ length: 5 }, () => rngB());

    expect(sequenceA).toEqual(sequenceB);
    expect(sequenceA.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});

describe("shuffleWithSeed", () => {
  it("creates deterministic shuffles per seed and leaves the source array untouched", () => {
    const original = ["a", "b", "c", "d", "e"] as const;

    const shuffledOne = shuffleWithSeed(original, "veilcraft-seed");
    const shuffledTwo = shuffleWithSeed(original, "veilcraft-seed");
    const shuffledDifferent = shuffleWithSeed(original, "veilcraft-alt");

    expect(shuffledOne).toEqual(shuffledTwo);
    expect(shuffledOne).not.toBe(original);
    expect([...original]).toEqual(["a", "b", "c", "d", "e"]);
    expect(shuffledDifferent).not.toEqual(shuffledOne);
  });
});
