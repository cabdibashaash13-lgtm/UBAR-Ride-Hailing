import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { ratedById, stars, comment } = body;

    if (!ratedById || !stars || stars < 1 || stars > 5) {
      return NextResponse.json(
        { success: false, error: "ratedById and stars (1-5) are required" },
        { status: 400 }
      );
    }

    const rating = await prisma.rating.create({
      data: { tripId: id, ratedById, stars, comment },
    });

    // Update driver rating
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (trip?.driverId) {
      const allRatings = await prisma.rating.findMany({
        where: { trip: { driverId: trip.driverId } },
      });
      const avgRating = allRatings.reduce((sum, r) => sum + r.stars, 0) / allRatings.length;
      await prisma.driver.update({
        where: { id: trip.driverId },
        data: { rating: Math.round(avgRating * 10) / 10, totalRatings: allRatings.length },
      });
    }

    return NextResponse.json({ success: true, data: rating });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit rating";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
