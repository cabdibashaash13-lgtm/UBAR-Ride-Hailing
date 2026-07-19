import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");

    if (!driverId) return NextResponse.json({ success: false, error: "driverId required" }, { status: 400 });

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [todayEarnings, weekEarnings, monthEarnings, driver] = await Promise.all([
      prisma.earning.aggregate({ where: { driverId, date: { gte: todayStart } }, _sum: { amount: true } }),
      prisma.earning.aggregate({ where: { driverId, date: { gte: weekStart } }, _sum: { amount: true } }),
      prisma.earning.aggregate({ where: { driverId, date: { gte: monthStart } }, _sum: { amount: true } }),
      prisma.driver.findUnique({ where: { id: driverId }, select: { totalTrips: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        today: todayEarnings._sum.amount || 0,
        thisWeek: weekEarnings._sum.amount || 0,
        thisMonth: monthEarnings._sum.amount || 0,
        totalTrips: driver?.totalTrips || 0,
        currency: "USD",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch earnings";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
