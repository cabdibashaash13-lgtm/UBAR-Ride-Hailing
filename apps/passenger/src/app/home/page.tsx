"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type VehicleType = "BAJAJ" | "MOTORCYCLE";

interface FareEstimate {
  baseFare: number;
  perKmRate: number;
  distanceKm: number;
  estimatedFare: number;
  estimatedDurationMinutes: number;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; fullName: string; passengerId?: string } | null>(null);
  const [pickup, setPickup] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [dropoff, setDropoff] = useState<{ lat: number; lng: number; address: string }>({
    lat: 2.0469, lng: 45.3182, address: ""
  });
  const [vehicleType, setVehicleType] = useState<VehicleType>("BAJAJ");
  const [fareEstimate, setFareEstimate] = useState<FareEstimate | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestingRide, setRequestingRide] = useState(false);

  // Check auth
  useEffect(() => {
    const stored = localStorage.getItem("ubar_user");
    if (!stored) {
      router.push("/auth/login");
      return;
    }
    setUser(JSON.parse(stored));
  }, [router]);

  // Get current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPickup({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            address: "Current Location",
          });
        },
        () => {
          // Default to Mogadishu
          setPickup({ lat: 2.0469, lng: 45.3182, address: "Mogadishu (default)" });
        }
      );
    }
  }, []);

  // Calculate fare estimate
  const updateFare = useCallback(() => {
    if (!pickup || !dropoff.lat || !dropoff.lng) return;

    const R = 6371;
    const dLat = ((dropoff.lat - pickup.lat) * Math.PI) / 180;
    const dLng = ((dropoff.lng - pickup.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((pickup.lat * Math.PI) / 180) * Math.cos((dropoff.lat * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const rates = vehicleType === "BAJAJ"
      ? { baseFare: 2, perKm: 0.5, minFare: 2 }
      : { baseFare: 1.5, perKm: 0.35, minFare: 1.5 };

    const estimatedFare = Math.max(rates.baseFare + rates.perKm * distance, rates.minFare);

    setFareEstimate({
      baseFare: rates.baseFare,
      perKmRate: rates.perKm,
      distanceKm: Math.round(distance * 100) / 100,
      estimatedFare: Math.round(estimatedFare * 100) / 100,
      estimatedDurationMinutes: Math.round(distance * 3 + 5),
    });
  }, [pickup, dropoff, vehicleType]);

  useEffect(() => {
    updateFare();
  }, [updateFare]);

  const handleRequestRide = async () => {
    if (!user?.passengerId || !pickup || !dropoff.lat || !dropoff.lng) return;
    setRequestingRide(true);

    try {
      const res = await fetch("/api/trips/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          passengerId: user.passengerId,
          vehicleType,
          pickupLat: pickup.lat,
          pickupLng: pickup.lng,
          pickupAddress: pickup.address,
          dropoffLat: dropoff.lat,
          dropoffLng: dropoff.lng,
          dropoffAddress: dropoff.address,
          distanceKm: fareEstimate?.distanceKm,
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/trip/${data.data.id}`);
      }
    } catch {
      alert("Failed to request ride. Please try again.");
    } finally {
      setRequestingRide(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("ubar_user");
    router.push("/");
  };

  if (!user) return null;

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background z-10">
        <div>
          <h1 className="text-xl font-bold text-primary">UBAR</h1>
          <p className="text-xs text-muted-foreground">Hi, {user.fullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/history" className="text-sm text-muted-foreground hover:text-primary">
            History
          </Link>
          <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive cursor-pointer">
            Logout
          </button>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative bg-muted/30">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-6xl">{vehicleType === "BAJAJ" ? "🛺" : "🛵"}</div>
            <p className="text-muted-foreground text-sm">
              {pickup ? `Pickup: ${pickup.address}` : "Detecting location..."}
            </p>
            {pickup && (
              <p className="text-xs text-muted-foreground">
                {pickup.lat.toFixed(4)}, {pickup.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Floating pickup marker */}
        {pickup && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-4 h-4 rounded-full bg-primary border-2 border-white shadow-lg" />
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div className="border-t bg-background p-4 space-y-4 max-h-[55vh] overflow-y-auto rounded-t-2xl shadow-2xl -mt-4 relative z-10">
        {/* Destination Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Where to?</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter destination address"
              value={dropoff.address}
              onChange={(e) => setDropoff({ ...dropoff, address: e.target.value })}
              className="flex-1 h-11 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="flex gap-2 text-xs">
            <input
              type="number"
              step="0.0001"
              placeholder="Lat"
              value={dropoff.lat || ""}
              onChange={(e) => setDropoff({ ...dropoff, lat: parseFloat(e.target.value) || 0 })}
              className="flex-1 h-8 rounded border border-input bg-transparent px-2 text-xs"
            />
            <input
              type="number"
              step="0.0001"
              placeholder="Lng"
              value={dropoff.lng || ""}
              onChange={(e) => setDropoff({ ...dropoff, lng: parseFloat(e.target.value) || 0 })}
              className="flex-1 h-8 rounded border border-input bg-transparent px-2 text-xs"
            />
            <button
              onClick={() => setDropoff({ lat: 2.0469, lng: 45.3182, address: "Mogadishu Center" })}
              className="px-3 rounded bg-secondary text-xs cursor-pointer"
            >
              Demo
            </button>
          </div>
        </div>

        {/* Vehicle Selector */}
        <div className="flex gap-3">
          <button
            onClick={() => setVehicleType("BAJAJ")}
            className={`flex-1 p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
              vehicleType === "BAJAJ"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-3xl">🛺</span>
            <p className="text-sm font-medium mt-1">Bajaj</p>
            <p className="text-xs text-muted-foreground">Comfortable 3-wheeler</p>
          </button>
          <button
            onClick={() => setVehicleType("MOTORCYCLE")}
            className={`flex-1 p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
              vehicleType === "MOTORCYCLE"
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <span className="text-3xl">🛵</span>
            <p className="text-sm font-medium mt-1">Motorcycle</p>
            <p className="text-xs text-muted-foreground">Fast & affordable</p>
          </button>
        </div>

        {/* Fare Estimate */}
        {fareEstimate && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Estimated Fare</p>
              <p className="text-xl font-bold">${fareEstimate.estimatedFare.toFixed(2)}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs text-muted-foreground">
                {fareEstimate.distanceKm} km &bull; ~{fareEstimate.estimatedDurationMinutes} min
              </p>
              <p className="text-xs text-muted-foreground">
                Base: ${fareEstimate.baseFare} + ${fareEstimate.perKmRate}/km
              </p>
            </div>
          </div>
        )}

        {/* Request Button */}
        <button
          onClick={handleRequestRide}
          disabled={requestingRide || loading || !pickup || !dropoff.lat}
          className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {requestingRide ? "Requesting..." : "Request Ride"}
        </button>
      </div>
    </main>
  );
}
