import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { ShareRequestSchema } from "@/lib/schema";
import { createShareRecord } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = ShareRequestSchema.parse(json);

    const record = createShareRecord(payload);
    const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? null;
    const relativeUrl = `/share/${record.id}`;
    const shareUrl = origin ? new URL(relativeUrl, origin).toString() : null;
    const relativeOgImageUrl = `/api/og?shareId=${record.id}`;
    const ogImageUrl = origin ? new URL(relativeOgImageUrl, origin).toString() : null;

    return NextResponse.json(
      {
        id: record.id,
        shareUrl,
        relativeUrl,
        ogImageUrl,
        relativeOgImageUrl,
        createdAt: record.createdAt,
        seed: record.seed,
        spreadId: record.spreadId,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Share payload validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("/api/share error", error);
    return NextResponse.json(
      {
        error: "share_creation_failed",
        message: "Failed to create share record. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
