import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { FeedbackRequestSchema } from "@/lib/schema";
import { createFeedbackRecord } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = FeedbackRequestSchema.parse(json);

    const record = createFeedbackRecord(payload);

    return NextResponse.json(
      {
        id: record.id,
        createdAt: record.createdAt,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Feedback payload validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("/api/feedback error", error);
    return NextResponse.json(
      {
        error: "feedback_creation_failed",
        message: "Failed to record feedback. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
