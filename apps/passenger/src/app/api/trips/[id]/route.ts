import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        driver: {
          include: {
            user: true,
            vehicle: true,
          },
        },
        passenger: {
          include: { user: true },
        },
        payment: true,
        rating: true,
      },
    });

    if (!trip) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: trip });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch trip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
