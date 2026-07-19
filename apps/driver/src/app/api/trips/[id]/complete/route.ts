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
      data: { status: "COMPLETED", completedAt: new Date() },
    });

    // Update driver earnings
    if (trip.driverId && trip.fare) {
      await prisma.driver.update({
        where: { id: trip.driverId },
        data: { totalEarnings: { increment: trip.fare } },
      });

      await prisma.earning.create({
        data: {
          driverId: trip.driverId,
          tripId: trip.id,
          amount: trip.fare,
          currency: trip.currency,
        },
      });
    }

    return NextResponse.json({ success: true, data: trip });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to complete trip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
