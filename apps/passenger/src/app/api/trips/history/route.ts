import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const passengerId = searchParams.get("passengerId");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    if (!passengerId) {
      return NextResponse.json({ success: false, error: "passengerId required" }, { status: 400 });
    }

    const [trips, total] = await Promise.all([
      prisma.trip.findMany({
        where: { passengerId },
        include: {
          driver: { include: { user: true, vehicle: true } },
          payment: true,
          rating: true,
        },
        orderBy: { requestedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.trip.count({ where: { passengerId } }),
    ]);

    return NextResponse.json({
      success: true,
      data: trips,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch history";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
