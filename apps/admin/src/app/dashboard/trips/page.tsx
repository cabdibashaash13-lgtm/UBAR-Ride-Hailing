"use client";
import { useState, useEffect } from "react";

interface Trip {
  id: string; passengerName: string; driverName?: string;
  pickupAddress: string; dropoffAddress: string;
  fare: number; status: string; vehicleType: string; createdAt: string;
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  const fetchTrips = () => {
    setLoading(true);
    const params = filter !== "ALL" ? `?status=${filter}` : "";
    fetch(`/api/trips${params}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setTrips(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchTrips(); }, [filter]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      REQUESTED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      ACCEPTED: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      IN_PROGRESS: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      COMPLETED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trips</h1>
        <p className="text-sm text-muted-foreground">{trips.length} trips found</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["ALL", "REQUESTED", "ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}>{f.replace("_", " ")}</button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : trips.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No trips found</p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">Passenger</th>
                  <th className="text-left px-4 py-3 font-medium">Driver</th>
                  <th className="text-left px-4 py-3 font-medium">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium">Route</th>
                  <th className="text-left px-4 py-3 font-medium">Fare</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-accent/50">
                    <td className="px-4 py-3 font-mono text-xs">{trip.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 font-medium">{trip.passengerName}</td>
                    <td className="px-4 py-3 text-muted-foreground">{trip.driverName || "—"}</td>
                    <td className="px-4 py-3">{trip.vehicleType === "BAJAJ" ? "🛺" : "🛵"}</td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="truncate text-xs">{trip.pickupAddress} → {trip.dropoffAddress}</p>
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">${(trip.fare ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(trip.status)}`}>
                        {trip.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(trip.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
