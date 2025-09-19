import type { FeedbackRequest, ShareRequest } from "./schema";

function generateId(prefix: string) {
  const uuid =
    typeof globalThis.crypto === "object" && typeof globalThis.crypto?.randomUUID === "function"
      ? globalThis.crypto.randomUUID()
      : undefined;

  if (uuid) {
    return uuid;
  }

  const random = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}${random}`;
}

export interface ShareRecord extends ShareRequest {
  id: string;
  createdAt: number;
}

const shareStore = new Map<string, ShareRecord>();

export function createShareRecord(input: ShareRequest): ShareRecord {
  const id = generateId("share");
  const record: ShareRecord = {
    id,
    createdAt: Date.now(),
    ...input,
  };
  shareStore.set(id, record);
  return record;
}

export function getShareRecord(id: string): ShareRecord | undefined {
  return shareStore.get(id);
}

export interface FeedbackRecord extends FeedbackRequest {
  id: string;
  createdAt: number;
}

const feedbackStore: FeedbackRecord[] = [];

export function createFeedbackRecord(input: FeedbackRequest): FeedbackRecord {
  const record: FeedbackRecord = {
    id: generateId("feedback"),
    createdAt: Date.now(),
    readingId: input.readingId,
    score: input.score,
    tags: input.tags?.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
    comment: input.comment?.trim() || undefined,
  };
  feedbackStore.push(record);
  return record;
}

export function listFeedbackForReading(readingId: string): FeedbackRecord[] {
  return feedbackStore.filter((entry) => entry.readingId === readingId);
}
