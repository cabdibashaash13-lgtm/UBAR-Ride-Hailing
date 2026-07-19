"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface TripData {
  id: string; status: string; vehicleType: string;
  pickupLat: number; pickupLng: number; pickupAddress?: string;
  dropoffLat?: number; dropoffLng?: number; dropoffAddress?: string;
  distanceKm?: number; durationMinutes?: number; fare?: number; currency: string;
  passenger: { id: string; name: string; phone: string };
  driver?: { id: string; name: string; phone: string };
  requestedAt: string; acceptedAt?: string; startedAt?: string; completedAt?: string;
}

export default function DriverTripDetail() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.id as string;
  const [trip, setTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/trips/${tripId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setTrip(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tripId]);

  const doAction = async (action: string) => {
    const stored = localStorage.getItem("ubar_driver");
    if (!stored) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: JSON.parse(stored).driverId }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh trip data
        const refreshed = await fetch(`/api/trips/${tripId}`).then((r) => r.json());
        if (refreshed.success) setTrip(refreshed.data);
      }
    } catch { /* ignore */ }
    finally { setActionLoading(false); }
  };

  const openNavigation = () => {
    if (!trip) return;
    const lat = trip.status === "ACCEPTED" ? trip.pickupLat : trip.dropoffLat;
    const lng = trip.status === "ACCEPTED" ? trip.pickupLng : trip.dropoffLng;
    if (lat && lng) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, "_blank");
    }
  };

  const callPassenger = () => {
    if (trip) window.open(`tel:${trip.passenger.phone}`, "_self");
  };

  if (loading) return <main className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading trip...</p></main>;
  if (!trip) return <main className="flex items-center justify-center min-h-screen"><p>Trip not found</p></main>;

  const statusSteps = ["REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED"];
  const currentStep = statusSteps.indexOf(trip.status);

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-lg font-bold">Trip Details</h1>
        <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${
          trip.status === "COMPLETED" ? "bg-green-100 text-green-700" :
          trip.status === "CANCELLED" ? "bg-red-100 text-red-700" :
          "bg-blue-100 text-blue-700"
        }`}>{trip.status.replace("_", " ")}</span>
      </header>

      <div className="flex-1 p-4 space-y-4">
        {/* Progress Steps */}
        {trip.status !== "CANCELLED" && (
          <div className="flex items-center justify-between px-2">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>{i + 1}</div>
                {i < statusSteps.length - 1 && (
                  <div className={`w-8 sm:w-12 h-1 ${i < currentStep ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Map Placeholder */}
        <div className="h-48 rounded-xl border-2 border-dashed border-border bg-muted/50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-2">🗺️</p>
            <p className="text-sm text-muted-foreground">Map view</p>
            <button onClick={openNavigation} className="mt-2 text-sm text-primary font-medium hover:underline cursor-pointer">
              Open in Google Maps
            </button>
          </div>
        </div>

        {/* Passenger Info */}
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="font-semibold mb-3">Passenger</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
                {trip.passenger.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{trip.passenger.name}</p>
                <p className="text-sm text-muted-foreground">{trip.passenger.phone}</p>
              </div>
            </div>
            <button onClick={callPassenger} className="p-3 rounded-full bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer">
              📞 Call
            </button>
          </div>
        </div>

        {/* Route Info */}
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="font-semibold mb-3">Route</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Pickup</p>
                <p className="font-medium">{trip.pickupAddress || `${trip.pickupLat}, ${trip.pickupLng}`}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Dropoff</p>
                <p className="font-medium">{trip.dropoffAddress || (trip.dropoffLat ? `${trip.dropoffLat}, ${trip.dropoffLng}` : "Not set")}</p>
              </div>
            </div>
          </div>
          {trip.distanceKm && (
            <div className="mt-3 pt-3 border-t flex justify-between text-sm">
              <span className="text-muted-foreground">Distance: {trip.distanceKm.toFixed(1)} km</span>
              <span className="text-muted-foreground">~{trip.durationMinutes || Math.round(trip.distanceKm * 3)} min</span>
            </div>
          )}
        </div>

        {/* Fare */}
        <div className="p-4 rounded-xl border bg-card text-center">
          <p className="text-xs text-muted-foreground">Fare</p>
          <p className="text-3xl font-bold text-primary">${(trip.fare ?? 0).toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">{trip.vehicleType === "BAJAJ" ? "🛺 Bajaj" : "🛵 Motorcycle"}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          {trip.status === "REQUESTED" && (
            <div className="flex gap-3">
              <button onClick={() => doAction("accept")} disabled={actionLoading}
                className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 cursor-pointer">
                {actionLoading ? "..." : "Accept Ride"}
              </button>
            </div>
          )}
          {trip.status === "ACCEPTED" && (
            <div className="flex gap-3">
              <button onClick={openNavigation}
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer">
                Navigate to Pickup
              </button>
              <button onClick={() => doAction("start")} disabled={actionLoading}
                className="flex-1 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
                {actionLoading ? "..." : "Start Trip"}
              </button>
            </div>
          )}
          {trip.status === "IN_PROGRESS" && (
            <div className="flex gap-3">
              <button onClick={openNavigation}
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer">
                Navigate to Dropoff
              </button>
              <button onClick={() => doAction("complete")} disabled={actionLoading}
                className="flex-1 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 cursor-pointer">
                {actionLoading ? "..." : "Complete Trip"}
              </button>
            </div>
          )}
          {trip.status === "COMPLETED" && (
            <div className="text-center p-4 rounded-xl bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <p className="text-2xl mb-1">✅</p>
              <p className="font-semibold text-green-700 dark:text-green-400">Trip Completed!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
