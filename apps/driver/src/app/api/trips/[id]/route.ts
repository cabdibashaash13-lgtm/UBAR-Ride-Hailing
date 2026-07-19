import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        passenger: { include: { user: true } },
        driver: { include: { user: true, vehicle: true } },
        payment: true,
        rating: true,
      },
    });

    if (!trip) return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      data: {
        id: trip.id,
        status: trip.status,
        vehicleType: trip.vehicleType,
        pickupLat: trip.pickupLat,
        pickupLng: trip.pickupLng,
        pickupAddress: trip.pickupAddress,
        dropoffLat: trip.dropoffLat,
        dropoffLng: trip.dropoffLng,
        dropoffAddress: trip.dropoffAddress,
        distanceKm: trip.distanceKm,
        durationMinutes: trip.durationMinutes,
        fare: trip.fare,
        currency: trip.currency,
        passenger: { id: trip.passenger.id, name: trip.passenger.user.fullName, phone: trip.passenger.user.phone },
        driver: trip.driver ? { id: trip.driver.id, name: trip.driver.user.fullName, phone: trip.driver.user.phone, vehicle: trip.driver.vehicle } : null,
        payment: trip.payment ? { method: trip.payment.method, amount: trip.payment.amount, status: trip.payment.status } : null,
        rating: trip.rating ? { stars: trip.rating.stars, comment: trip.rating.comment } : null,
        requestedAt: trip.requestedAt.toISOString(),
        acceptedAt: trip.acceptedAt?.toISOString(),
        startedAt: trip.startedAt?.toISOString(),
        completedAt: trip.completedAt?.toISOString(),
      },
    });
  } catch (error) {
    console.error("Trip detail error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch trip" }, { status: 500 });
  }
}
