"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Driver {
  id: string; fullName: string; phone: string; status: string;
  vehicleType: string; plateNumber: string; rating: number; totalTrips: number;
  createdAt: string;
}

export default function DriversPage() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchDrivers = () => {
    setLoading(true);
    const params = filter !== "ALL" ? `?status=${filter}` : "";
    fetch(`/api/drivers${params}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setDrivers(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDrivers(); }, [filter]);

  const doAction = async (driverId: string, action: string) => {
    setActionLoading(driverId + action);
    try {
      await fetch(`/api/drivers/${driverId}/${action}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      fetchDrivers();
    } catch { /* ignore */ }
    finally { setActionLoading(null); }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      BLOCKED: "bg-red-200 text-red-800 dark:bg-red-900/50 dark:text-red-300",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Drivers</h1>
          <p className="text-sm text-muted-foreground">{drivers.length} drivers found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["ALL", "PENDING", "APPROVED", "REJECTED", "BLOCKED"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}>{f}</button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : drivers.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No drivers found</p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Driver</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Vehicle</th>
                  <th className="text-left px-4 py-3 font-medium">Status</th>
                  <th className="text-left px-4 py-3 font-medium">Rating</th>
                  <th className="text-left px-4 py-3 font-medium">Trips</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {driver.fullName.charAt(0)}
                        </div>
                        <Link href={`/dashboard/drivers/${driver.id}`} className="font-medium hover:text-primary hover:underline">
                          {driver.fullName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{driver.phone}</td>
                    <td className="px-4 py-3">{driver.vehicleType === "BAJAJ" ? "🛺" : "🛵"} {driver.plateNumber}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(driver.status)}`}>{driver.status}</span>
                    </td>
                    <td className="px-4 py-3">{driver.rating.toFixed(1)} ★</td>
                    <td className="px-4 py-3">{driver.totalTrips}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {driver.status === "PENDING" && (
                          <>
                            <button onClick={() => doAction(driver.id, "approve")} disabled={!!actionLoading}
                              className="px-2 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 disabled:opacity-50 cursor-pointer">Approve</button>
                            <button onClick={() => doAction(driver.id, "reject")} disabled={!!actionLoading}
                              className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50 cursor-pointer">Reject</button>
                          </>
                        )}
                        {driver.status === "APPROVED" && (
                          <button onClick={() => doAction(driver.id, "block")} disabled={!!actionLoading}
                            className="px-2 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50 cursor-pointer">Block</button>
                        )}
                      </div>
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
