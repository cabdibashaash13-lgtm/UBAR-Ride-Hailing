import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");

    const where = status ? { status } : {};

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where,
        include: {
          passenger: {
            include: {
              user: {
                select: {
                  fullName: true,
                  phone: true,
                },
              },
            },
          },
          driver: {
            include: {
              user: {
                select: {
                  fullName: true,
                  phone: true,
                },
              },
              vehicle: true,
            },
          },
          payment: true,
        },
        orderBy: {
          requestedAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.trip.count({ where }),
    ]);

    const formatted = trips.map((t: any) => ({
      id: t.id,
      passengerName: t.passenger?.user?.fullName || "Unknown",
      driverName: t.driver?.user?.fullName || null,
      pickupAddress: t.pickupAddress || "Pickup",
      dropoffAddress: t.dropoffAddress || "Dropoff",
      fare: t.fare ?? 0,
      status: t.status,
      vehicleType: t.vehicleType,
      createdAt: t.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch trips";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}