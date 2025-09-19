import { ImageResponse } from "next/og";

import { getShareRecord } from "@/lib/storage";
import { spreadMap } from "@/lib/spreads";

import { renderOgImage } from "./og-template";

export const runtime = "edge";
export const alt = "Veilcraft｜幕术 分享图卡";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const fallbackThemes = ["证据驱动", "玻璃质感", "可执行建议"] as const;
const fallbackOverview =
  "Veilcraft 以确定性抽牌与结构化 AI 解读为核心，帮助你把模糊的处境化为可执行的下一步。";

function normaliseTheme(values: readonly string[] | undefined) {
  if (!values) {
    return [...fallbackThemes];
  }

  const cleaned = values.map((value) => value.trim()).filter((value) => value.length > 0);

  if (cleaned.length === 0) {
    return [...fallbackThemes];
  }

  return cleaned.slice(0, 4);
}

function truncate(value: string | null | undefined, length: number) {
  if (!value) {
    return "";
  }
  if (value.length <= length) {
    return value;
  }
  return `${value.slice(0, length - 1)}…`;
}

function buildThemeFromParams(params: URLSearchParams) {
  const raw = params.getAll("theme");
  if (raw.length === 0) {
    return undefined;
  }

  const flattened = raw
    .flatMap((entry) => entry.split(","))
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0);

  return flattened.length > 0 ? flattened : undefined;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const shareId = searchParams.get("shareId") ?? searchParams.get("id");
  const spreadParam = searchParams.get("spreadId") ?? searchParams.get("spread") ?? undefined;
  const seedParam = searchParams.get("seed") ?? undefined;

  let question = searchParams.get("question") ?? "幕起。占卜，不再含糊。";
  let overview = searchParams.get("overview") ?? fallbackOverview;
  let spreadId = spreadParam;
  let themes = buildThemeFromParams(searchParams);
  let seed = seedParam;
  let statusNote: string | null = null;

  if (shareId) {
    const record = getShareRecord(shareId);
    if (record) {
      question = record.question.text;
      overview = record.reading.overview;
      spreadId = record.spreadId;
      themes = record.reading.theme;
      seed = record.seed;
    } else {
      statusNote = "分享内容未命中缓存，展示默认预览";
    }
  }

  const spread = spreadId ? spreadMap[spreadId] : undefined;
  const resolvedThemes = normaliseTheme(themes);
  const resolvedSeed = seed ? seed.toUpperCase().slice(0, 12) : null;

  const title = truncate(question, 120);
  const summary = truncate(overview, 220) || fallbackOverview;
  const spreadLabel = spread?.name ?? "Veilcraft Reading";
  const spreadTagline = spread?.tagline ?? "揭幕不确定，打磨可行动。";

  return new ImageResponse(
    renderOgImage({
      title,
      summary,
      themes: resolvedThemes,
      spreadLabel,
      spreadTagline,
      seed: resolvedSeed,
      statusNote,
    }),
    {
      ...size,
    },
  );
}
