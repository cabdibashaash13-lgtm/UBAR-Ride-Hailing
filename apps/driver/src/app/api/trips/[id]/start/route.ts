import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.update({
      where: { id },
      data: { status: "IN_PROGRESS", startedAt: new Date() },
    });
    return NextResponse.json({ success: true, data: trip });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to start trip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
