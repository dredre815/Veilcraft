import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { buildMockReading } from "@/lib/mock-reading";
import { InterpretRequestSchema } from "@/lib/schema";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = InterpretRequestSchema.parse(json);

    const reading = buildMockReading(payload);

    return NextResponse.json(reading);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "invalid_request",
          message: "Interpret request validation failed",
          issues: error.issues,
        },
        { status: 400 },
      );
    }

    console.error("/api/interpret error", error);
    return NextResponse.json(
      {
        error: "interpret_generation_failed",
        message: "Failed to build mock reading. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
