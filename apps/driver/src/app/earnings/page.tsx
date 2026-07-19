"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function EarningsPage() {
  const [earnings, setEarnings] = useState({ today: 0, thisWeek: 0, thisMonth: 0, totalTrips: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const driver = JSON.parse(localStorage.getItem("ubar_driver") || "{}");
    if (!driver.driverId) return;
    fetch(`/api/earnings?driverId=${driver.driverId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setEarnings(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-lg font-bold">Earnings</h1>
      </header>
      <div className="flex-1 p-4 space-y-4">
        {loading ? <p className="text-center py-12 text-muted-foreground">Loading...</p> : (
          <div className="space-y-3">
            <div className="p-6 rounded-xl border bg-card text-center">
              <p className="text-xs text-muted-foreground">Total Earnings</p>
              <p className="text-4xl font-bold text-primary">${earnings.thisMonth.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">This Month</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-xl font-bold">${earnings.today.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl border bg-card">
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-xl font-bold">${earnings.thisWeek.toFixed(2)}</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-card">
              <p className="text-xs text-muted-foreground">Total Trips Completed</p>
              <p className="text-2xl font-bold">{earnings.totalTrips}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
