import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { driverId } = await request.json();

    const trip = await prisma.trip.update({
      where: { id },
      data: { driverId, status: "ACCEPTED", acceptedAt: new Date() },
    });

    await prisma.driver.update({ where: { id: driverId }, data: { totalTrips: { increment: 1 } } });

    return NextResponse.json({ success: true, data: trip });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to accept trip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
