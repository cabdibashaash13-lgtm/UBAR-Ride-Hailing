import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const driverId = req.nextUrl.searchParams.get("driverId");
    if (!driverId) return NextResponse.json({ success: false, error: "driverId required" }, { status: 400 });

    const trips = await prisma.trip.findMany({
      where: { driverId },
      include: {
        passenger: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const formatted = trips.map((t) => ({
      id: t.id,
      passengerName: t.passenger.user.fullName,
      pickupAddress: t.pickupAddress || "Pickup location",
      dropoffAddress: t.dropoffAddress || "Dropoff location",
      fare: t.fare ?? 0,
      distanceKm: t.distanceKm,
      durationMinutes: t.durationMinutes,
      status: t.status,
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Driver trip history error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch trips" }, { status: 500 });
  }
}
