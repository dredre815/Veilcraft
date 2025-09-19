import { NextResponse } from "next/server";

import { getShareRecord } from "@/lib/storage";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id: shareId } = await context.params;
  const record = getShareRecord(shareId);

  if (!record) {
    return NextResponse.json(
      {
        error: "share_not_found",
        message: "Share record not found",
      },
      { status: 404 },
    );
  }

  return NextResponse.json(record);
}
