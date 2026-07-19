"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Trip {
  id: string;
  status: string;
  vehicleType: string;
  fare?: number;
  distanceKm?: number;
  requestedAt: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  driver?: { user: { fullName: string }; vehicle?: { plateNumber: string } };
}

export default function HistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("ubar_user") || "{}");
    if (!user.passengerId) return;

    fetch(`/api/trips/history?passengerId=${user.passengerId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTrips(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/home" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-lg font-bold">Trip History</h1>
      </header>

      <div className="flex-1 p-4 space-y-3">
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <p className="text-4xl">🛺</p>
            <p className="text-muted-foreground">No trips yet</p>
            <Link href="/home" className="text-primary hover:underline">Book a ride</Link>
          </div>
        ) : (
          trips.map((trip) => (
            <Link key={trip.id} href={`/trip/${trip.id}`} className="block">
              <div className="p-4 rounded-xl border bg-card hover:shadow-md transition-shadow space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{trip.vehicleType === "BAJAJ" ? "🛺" : "🛵"}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[trip.status] || ""}`}>
                      {trip.status.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-bold">${trip.fare?.toFixed(2)}</p>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{trip.pickupAddress || "Pickup"} &rarr; {trip.dropoffAddress || "Dropoff"}</p>
                  <div className="flex justify-between">
                    <span>{trip.distanceKm?.toFixed(1)} km</span>
                    <span>{new Date(trip.requestedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {trip.driver && (
                  <p className="text-xs text-muted-foreground">
                    Driver: {trip.driver.user.fullName} &bull; {trip.driver.vehicle?.plateNumber}
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}
