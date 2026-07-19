"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface TripData {
  id: string;
  status: string;
  vehicleType: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  distanceKm?: number;
  durationMinutes?: number;
  fare?: number;
  currency: string;
  requestedAt: string;
  driver?: {
    user: { fullName: string; phone: string; photoUrl?: string };
    vehicle?: { plateNumber: string; type: string; model?: string };
    rating: number;
  };
}

export default function TripPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchTrip = async () => {
      try {
        const res = await fetch(`/api/trips/${id}`);
        const data = await res.json();
        if (data.success) setTrip(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    };
    fetchTrip();
    const interval = setInterval(fetchTrip, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleCancel = async () => {
    if (!confirm("Cancel this ride?")) return;
    try {
      await fetch(`/api/trips/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Cancelled by passenger" }),
      });
      router.push("/home");
    } catch {
      alert("Failed to cancel ride");
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <div className="animate-pulse text-primary text-4xl">🛺</div>
        <p className="mt-4 text-muted-foreground">Loading trip...</p>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Trip not found</p>
        <Link href="/home" className="mt-4 text-primary hover:underline">Go Home</Link>
      </main>
    );
  }

  const statusColors: Record<string, string> = {
    REQUESTED: "bg-yellow-100 text-yellow-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    IN_PROGRESS: "bg-purple-100 text-purple-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <Link href="/home" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[trip.status] || "bg-gray-100"}`}>
          {trip.status.replace("_", " ")}
        </span>
      </header>

      {/* Map placeholder */}
      <div className="h-64 bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <span className="text-5xl">{trip.vehicleType === "BAJAJ" ? "🛺" : "🛵"}</span>
          <p className="text-sm text-muted-foreground mt-2">
            {trip.status === "REQUESTED" ? "Finding driver..." : trip.status === "ACCEPTED" ? "Driver on the way" : trip.status}
          </p>
        </div>
      </div>

      {/* Trip Details */}
      <div className="flex-1 p-4 space-y-4">
        {/* Driver Info */}
        {trip.driver && (
          <div className="p-4 rounded-xl border bg-card space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold">
                {trip.driver.user.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{trip.driver.user.fullName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  {"★".repeat(Math.round(trip.driver.rating))} {trip.driver.rating.toFixed(1)}
                </p>
              </div>
              <a
                href={`tel:${trip.driver.user.phone}`}
                className="px-4 py-2 rounded-lg bg-secondary text-sm font-medium"
              >
                Call
              </a>
            </div>
            {trip.driver.vehicle && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{trip.vehicleType === "BAJAJ" ? "🛺" : "🛵"}</span>
                <span>{trip.driver.vehicle.model || trip.driver.vehicle.type}</span>
                <span className="font-mono bg-secondary px-2 py-0.5 rounded">{trip.driver.vehicle.plateNumber}</span>
              </div>
            )}
          </div>
        )}

        {/* Trip Info */}
        <div className="p-4 rounded-xl border bg-card space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-primary mt-1" />
            <div>
              <p className="text-xs text-muted-foreground">Pickup</p>
              <p className="text-sm">{trip.pickupAddress || "Current Location"}</p>
            </div>
          </div>
          <div className="ml-1.5 h-6 border-l border-dashed border-border" />
          <div className="flex items-start gap-3">
            <div className="w-3 h-3 rounded-full bg-destructive mt-1" />
            <div>
              <p className="text-xs text-muted-foreground">Dropoff</p>
              <p className="text-sm">{trip.dropoffAddress || "Destination"}</p>
            </div>
          </div>
        </div>

        {/* Fare */}
        <div className="p-4 rounded-xl border bg-card flex justify-between items-center">
          <div>
            <p className="text-xs text-muted-foreground">Fare</p>
            <p className="text-2xl font-bold">${trip.fare?.toFixed(2)}</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>{trip.distanceKm?.toFixed(1)} km</p>
            <p>~{trip.durationMinutes} min</p>
          </div>
        </div>

        {/* Actions */}
        {(trip.status === "REQUESTED" || trip.status === "ACCEPTED") && (
          <button
            onClick={handleCancel}
            className="w-full h-11 rounded-lg border border-destructive text-destructive font-medium hover:bg-destructive/5 transition-colors cursor-pointer"
          >
            Cancel Ride
          </button>
        )}

        {trip.status === "COMPLETED" && (
          <div className="space-y-3">
            <Link
              href={`/trip/${id}/rate`}
              className="block w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-center leading-[44px] hover:bg-primary/90"
            >
              Rate & Pay
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
