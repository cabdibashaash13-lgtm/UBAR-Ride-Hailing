"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Trip {
  id: string;
  passengerName: string;
  pickupAddress: string;
  dropoffAddress: string;
  fare: number;
  status: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const driver = JSON.parse(localStorage.getItem("ubar_driver") || "{}");
    if (!driver.driverId) return;
    fetch(`/api/trips/history?driverId=${driver.driverId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setTrips(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-lg font-bold">Trip History</h1>
      </header>
      <div className="flex-1 p-4">
        {loading ? (
          <p className="text-center py-12 text-muted-foreground">Loading...</p>
        ) : trips.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-muted-foreground">No trips yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/trip/${trip.id}`} className="block p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold">{trip.passengerName}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(trip.createdAt)}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(trip.status)}`}>
                    {trip.status}
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground truncate">📍 {trip.pickupAddress}</p>
                  <p className="text-muted-foreground truncate">🎯 {trip.dropoffAddress}</p>
                </div>
                <div className="mt-3 pt-3 border-t flex justify-between items-center">
                  <span className="text-lg font-bold text-primary">${trip.fare.toFixed(2)}</span>
                  <span className="text-sm text-muted-foreground">View Details &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
