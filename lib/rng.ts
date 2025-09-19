const BASE58_ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" as const;

function bytesToBase58(bytes: Uint8Array): string {
  let carry: number;
  const digits: number[] = [0];

  for (let i = 0; i < bytes.length; i += 1) {
    carry = bytes[i];
    for (let j = 0; j < digits.length; j += 1) {
      const value = digits[j] * 256 + carry;
      digits[j] = value % 58;
      carry = Math.floor(value / 58);
    }
    while (carry > 0) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }

  let leadingZeroCount = 0;
  for (let k = 0; k < bytes.length && bytes[k] === 0; k += 1) {
    leadingZeroCount += 1;
  }

  const result = new Array(leadingZeroCount + digits.length);
  let index = 0;
  for (; index < leadingZeroCount; index += 1) {
    result[index] = BASE58_ALPHABET[0];
  }
  for (let n = 0; n < digits.length; n += 1) {
    result[index + n] = BASE58_ALPHABET[digits[digits.length - 1 - n]];
  }

  return result.join("");
}

function getRandomBytes(length: number): Uint8Array {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.getRandomValues === "function"
  ) {
    return globalThis.crypto.getRandomValues(new Uint8Array(length));
  }
  const array = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) {
    array[i] = Math.floor(Math.random() * 256);
  }
  return array;
}

export function generateSeed(byteLength = 16): string {
  const randomBytes = getRandomBytes(byteLength);
  return bytesToBase58(randomBytes);
}

function xmur3(str: string) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

function mulberry32(a: number) {
  return () => {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSeededRng(seed: string) {
  const seedFn = xmur3(seed);
  const state = seedFn();
  const rng = mulberry32(state);
  return () => rng();
}

export function shuffleWithSeed<T>(items: readonly T[], seed: string): T[] {
  const array = [...items];
  const rng = createSeededRng(`${seed}-shuffle`);
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
