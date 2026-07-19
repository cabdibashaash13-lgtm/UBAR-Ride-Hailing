"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

interface DriverDetail {
  id: string; fullName: string; phone: string; photoUrl?: string;
  status: string; isOnline: boolean; rating: number; totalTrips: number; totalEarnings: number;
  vehicle?: { type: string; plateNumber: string; model?: string; color?: string; year?: number };
  document?: { type: string; number: string; photoUrl: string; status: string; notes?: string };
  createdAt: string;
}

export default function DriverDetailPage() {
  const params = useParams();
  const router = useRouter();
  const driverId = params.id as string;
  const [driver, setDriver] = useState<DriverDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [showReject, setShowReject] = useState(false);

  const fetchDriver = () => {
    fetch(`/api/drivers/${driverId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setDriver(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDriver(); }, [driverId]);

  const doAction = async (action: string, extra?: Record<string, string>) => {
    setActionLoading(true);
    try {
      await fetch(`/api/drivers/${driverId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...extra }),
      });
      fetchDriver();
      setShowReject(false);
    } catch { /* ignore */ }
    finally { setActionLoading(false); }
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

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>;
  if (!driver) return <div className="text-center py-12"><p>Driver not found</p></div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/drivers" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
      </div>

      {/* Driver Header */}
      <div className="p-6 rounded-xl border bg-card">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold">
              {driver.fullName.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold">{driver.fullName}</h1>
              <p className="text-sm text-muted-foreground">{driver.phone}</p>
              <span className={`inline-block mt-1 text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(driver.status)}`}>
                {driver.status}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Rating</p>
            <p className="text-2xl font-bold">{driver.rating.toFixed(1)} ★</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card text-center">
          <p className="text-2xl font-bold">{driver.totalTrips}</p>
          <p className="text-xs text-muted-foreground">Total Trips</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-center">
          <p className="text-2xl font-bold">${driver.totalEarnings.toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Earnings</p>
        </div>
        <div className="p-4 rounded-xl border bg-card text-center">
          <p className="text-2xl font-bold">{driver.isOnline ? "🟢" : "🔴"}</p>
          <p className="text-xs text-muted-foreground">{driver.isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* Vehicle Info */}
      {driver.vehicle && (
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="font-semibold mb-3">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{driver.vehicle.type === "BAJAJ" ? "🛺 Bajaj" : "🛵 Motorcycle"}</span></div>
            <div><span className="text-muted-foreground">Plate:</span> <span className="font-medium">{driver.vehicle.plateNumber}</span></div>
            {driver.vehicle.model && <div><span className="text-muted-foreground">Model:</span> <span className="font-medium">{driver.vehicle.model}</span></div>}
            {driver.vehicle.color && <div><span className="text-muted-foreground">Color:</span> <span className="font-medium">{driver.vehicle.color}</span></div>}
          </div>
        </div>
      )}

      {/* Verification Document */}
      {driver.document && (
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="font-semibold mb-3">Verification Document</h3>
          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div><span className="text-muted-foreground">Type:</span> <span className="font-medium">{driver.document.type.replace("_", " ")}</span></div>
            <div><span className="text-muted-foreground">Number:</span> <span className="font-medium">{driver.document.number}</span></div>
            <div><span className="text-muted-foreground">Status:</span> <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(driver.document.status)}`}>{driver.document.status}</span></div>
          </div>
          {driver.document.photoUrl && (
            <div className="border rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={driver.document.photoUrl} alt="Verification Document" className="w-full h-48 object-cover" />
            </div>
          )}
          {driver.document.notes && (
            <p className="mt-3 text-sm text-muted-foreground">Notes: {driver.document.notes}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        {driver.status === "PENDING" && (
          <>
            <button onClick={() => doAction("approve")} disabled={actionLoading}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 cursor-pointer">
              {actionLoading ? "Processing..." : "Approve Driver"}
            </button>
            <button onClick={() => setShowReject(!showReject)}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 cursor-pointer">
              Reject Application
            </button>
            {showReject && (
              <div className="p-4 rounded-xl border bg-card space-y-3">
                <textarea placeholder="Rejection reason (optional)" value={rejectNote} onChange={(e) => setRejectNote(e.target.value)}
                  className="flex w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" rows={3} />
                <button onClick={() => doAction("reject", { note: rejectNote })} disabled={actionLoading}
                  className="w-full py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 cursor-pointer">
                  {actionLoading ? "Processing..." : "Confirm Rejection"}
                </button>
              </div>
            )}
          </>
        )}
        {driver.status === "APPROVED" && (
          <button onClick={() => doAction("block")} disabled={actionLoading}
            className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50 cursor-pointer">
            {actionLoading ? "Processing..." : "Block Driver"}
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Member since {new Date(driver.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
