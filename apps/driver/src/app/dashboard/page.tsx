"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DriverData {
  id: string; driverId: string; fullName: string; phone: string; photoUrl?: string;
  vehicle?: { type: string; plateNumber: string; model?: string };
  rating: number; isOnline: boolean;
}

interface Earnings { today: number; thisWeek: number; thisMonth: number; totalTrips: number }

export default function Dashboard() {
  const router = useRouter();
  const [driver, setDriver] = useState<DriverData | null>(null);
  const [earnings, setEarnings] = useState<Earnings>({ today: 0, thisWeek: 0, thisMonth: 0, totalTrips: 0 });
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ubar_driver");
    if (!stored) { router.push("/auth/login"); return; }
    const d = JSON.parse(stored);
    setDriver(d);
    fetch(`/api/earnings?driverId=${d.driverId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setEarnings(data.data); })
      .catch(() => {});
  }, [router]);

  const toggleOnline = async () => {
    if (!driver) return;
    setToggling(true);
    const newStatus = !driver.isOnline;
    try {
      await fetch("/api/status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ driverId: driver.driverId, isOnline: newStatus }),
      });
      const updated = { ...driver, isOnline: newStatus };
      setDriver(updated);
      localStorage.setItem("ubar_driver", JSON.stringify(updated));
    } catch { /* ignore */ }
    finally { setToggling(false); }
  };

  const handleLogout = () => { localStorage.removeItem("ubar_driver"); router.push("/"); };

  if (!driver) return null;

  return (
    <main className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b bg-background">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold">
            {driver.fullName.charAt(0)}
          </div>
          <div>
            <p className="font-semibold">{driver.fullName}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {driver.vehicle?.type === "BAJAJ" ? "🛺" : "🛵"} {driver.vehicle?.plateNumber}
              {" "}{"★"} {driver.rating.toFixed(1)}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive cursor-pointer">
          Logout
        </button>
      </header>

      <div className="flex-1 p-4 space-y-4">
        {/* Online Toggle */}
        <div className={`p-6 rounded-xl border-2 text-center transition-all ${driver.isOnline ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-border"}`}>
          <p className="text-2xl font-bold mb-2">{driver.isOnline ? "You're Online" : "You're Offline"}</p>
          <p className="text-sm text-muted-foreground mb-4">
            {driver.isOnline ? "You can receive ride requests" : "Go online to start receiving requests"}
          </p>
          <button
            onClick={toggleOnline}
            disabled={toggling}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors cursor-pointer ${
              driver.isOnline
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-600 text-white hover:bg-green-700"
            } disabled:opacity-50`}
          >
            {toggling ? "..." : driver.isOnline ? "Go Offline" : "Go Online"}
          </button>
        </div>

        {/* Earnings Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs text-muted-foreground">Today</p>
            <p className="text-xl font-bold">${earnings.today.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs text-muted-foreground">This Week</p>
            <p className="text-xl font-bold">${earnings.thisWeek.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs text-muted-foreground">This Month</p>
            <p className="text-xl font-bold">${earnings.thisMonth.toFixed(2)}</p>
          </div>
          <div className="p-4 rounded-xl border bg-card">
            <p className="text-xs text-muted-foreground">Total Trips</p>
            <p className="text-xl font-bold">{earnings.totalTrips}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2">
          <Link href="/earnings" className="block p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-medium">Earnings History</span>
              <span className="text-muted-foreground">&rarr;</span>
            </div>
          </Link>
          <Link href="/history" className="block p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-medium">Trip History</span>
              <span className="text-muted-foreground">&rarr;</span>
            </div>
          </Link>
          <Link href="/profile" className="block p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-medium">My Profile</span>
              <span className="text-muted-foreground">&rarr;</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
