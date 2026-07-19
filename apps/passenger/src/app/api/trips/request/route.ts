import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateFare } from "@ubar/shared-utils";
import { VehicleType } from "@ubar/shared-types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      passengerId,
      vehicleType,
      pickupLat,
      pickupLng,
      pickupAddress,
      dropoffLat,
      dropoffLng,
      dropoffAddress,
      distanceKm,
    } = body;

    if (!passengerId || !vehicleType || pickupLat == null || pickupLng == null || dropoffLat == null || dropoffLng == null) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const fareEstimate = calculateFare(
      vehicleType as VehicleType,
      distanceKm || 1
    );

    const trip = await prisma.trip.create({
      data: {
        passengerId,
        vehicleType: vehicleType as VehicleType,
        status: "REQUESTED",
        pickupLat,
        pickupLng,
        pickupAddress,
        dropoffLat,
        dropoffLng,
        dropoffAddress,
        distanceKm: fareEstimate.distanceKm,
        durationMinutes: fareEstimate.estimatedDurationMinutes,
        fare: fareEstimate.estimatedFare,
        currency: "USD",
      },
    });

    return NextResponse.json({ success: true, data: trip });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create trip";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
