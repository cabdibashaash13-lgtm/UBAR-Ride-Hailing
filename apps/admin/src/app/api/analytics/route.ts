import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalPassengers, totalDrivers, approvedDrivers, pendingDrivers,
      totalTrips, activeTrips, completedTrips, cancelledTrips, todayTrips,
      totalRevenue, todayRevenue,
    ] = await Promise.all([
      prisma.passenger.count(),
      prisma.driver.count(),
      prisma.driver.count({ where: { status: "APPROVED" } }),
      prisma.driver.count({ where: { status: "PENDING" } }),
      prisma.trip.count(),
      prisma.trip.count({ where: { status: { in: ["REQUESTED", "ACCEPTED", "IN_PROGRESS"] } } }),
      prisma.trip.count({ where: { status: "COMPLETED" } }),
      prisma.trip.count({ where: { status: "CANCELLED" } }),
      prisma.trip.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.payment.aggregate({ where: { status: "COMPLETED" }, _sum: { amount: true } }),
      prisma.payment.aggregate({ where: { status: "COMPLETED", paidAt: { gte: todayStart } }, _sum: { amount: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalPassengers,
        totalDrivers,
        approvedDrivers,
        pendingDrivers,
        totalTrips,
        activeTrips,
        completedTrips,
        cancelledTrips,
        todayTrips,
        totalRevenue: totalRevenue._sum.amount || 0,
        todayRevenue: todayRevenue._sum.amount || 0,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch analytics";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
