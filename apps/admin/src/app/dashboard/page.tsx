"use client";
import { useState, useEffect } from "react";

interface Stats {
  totalPassengers: number; totalDrivers: number; approvedDrivers: number;
  pendingDrivers: number; totalTrips: number; activeTrips: number;
  completedTrips: number; cancelledTrips: number; totalRevenue: number;
  todayTrips: number; todayRevenue: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((data) => { if (data.success) setStats(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading dashboard...</p></div>;

  const s = stats || { totalPassengers: 0, totalDrivers: 0, approvedDrivers: 0, pendingDrivers: 0, totalTrips: 0, activeTrips: 0, completedTrips: 0, cancelledTrips: 0, totalRevenue: 0, todayTrips: 0, todayRevenue: 0 };

  const statCards = [
    { label: "Total Passengers", value: s.totalPassengers, icon: "👥", color: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" },
    { label: "Total Drivers", value: s.totalDrivers, icon: "🚗", color: "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800" },
    { label: "Pending Approvals", value: s.pendingDrivers, icon: "⏳", color: "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800" },
    { label: "Active Trips", value: s.activeTrips, icon: "🟢", color: "bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of UBAR platform metrics</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`p-5 rounded-xl border ${card.color}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
            </div>
            <p className="text-3xl font-bold">{card.value}</p>
            <p className="text-sm text-muted-foreground">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Trip Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Trips</h3>
          <p className="text-3xl font-bold">{s.totalTrips}</p>
          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
            <span>✅ {s.completedTrips} completed</span>
            <span>❌ {s.cancelledTrips} cancelled</span>
          </div>
        </div>
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Today&apos;s Trips</h3>
          <p className="text-3xl font-bold">{s.todayTrips}</p>
        </div>
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</h3>
          <p className="text-3xl font-bold text-primary">${s.totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-1">Today: ${s.todayRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Driver Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="font-semibold mb-4">Driver Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Approved</span>
              <span className="font-bold text-green-600">{s.approvedDrivers}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${s.totalDrivers ? (s.approvedDrivers / s.totalDrivers) * 100 : 0}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <span className="font-bold text-yellow-600">{s.pendingDrivers}</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${s.totalDrivers ? (s.pendingDrivers / s.totalDrivers) * 100 : 0}%` }} />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-xl border bg-card">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/drivers" className="block p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium">
              Review Pending Drivers ({s.pendingDrivers})
            </a>
            <a href="/trips" className="block p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium">
              View Active Trips ({s.activeTrips})
            </a>
            <a href="/passengers" className="block p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium">
              Manage Passengers
            </a>
            <a href="/settings" className="block p-3 rounded-lg bg-accent hover:bg-accent/80 transition-colors text-sm font-medium">
              App Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
