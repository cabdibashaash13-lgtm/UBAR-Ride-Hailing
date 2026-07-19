import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { reason } = body;

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelReason: reason || "Cancelled by passenger",
      },
    });

    return NextResponse.json({ success: true, data: trip });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to cancel trip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
