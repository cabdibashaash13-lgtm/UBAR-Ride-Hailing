"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface DriverProfile {
  id: string; fullName: string; phone: string; photoUrl?: string;
  status: string; isOnline: boolean; rating: number; totalTrips: number; totalEarnings: number;
  vehicle?: { type: string; plateNumber: string; model?: string; color?: string; year?: number };
  document?: { type: string; number: string; status: string };
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ubar_driver");
    if (!stored) { router.push("/auth/login"); return; }
    const d = JSON.parse(stored);
    fetch(`/api/profile?driverId=${d.driverId}`)
      .then((r) => r.json())
      .then((data) => { if (data.success) setProfile(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      BLOCKED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  const getDocStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      PENDING: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
      REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return styles[status] || "bg-gray-100 text-gray-700";
  };

  if (loading) return <main className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></main>;
  if (!profile) return null;

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-lg font-bold">My Profile</h1>
      </header>
      <div className="flex-1 p-4 space-y-4">
        {/* Profile Header */}
        <div className="p-6 rounded-xl border bg-card text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
            {profile.fullName.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{profile.fullName}</h2>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
          <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(profile.status)}`}>
            {profile.status}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-xl border bg-card text-center">
            <p className="text-2xl font-bold">{profile.rating.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center">
            <p className="text-2xl font-bold">{profile.totalTrips}</p>
            <p className="text-xs text-muted-foreground">Trips</p>
          </div>
          <div className="p-4 rounded-xl border bg-card text-center">
            <p className="text-2xl font-bold">${profile.totalEarnings.toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Earned</p>
          </div>
        </div>

        {/* Vehicle Info */}
        {profile.vehicle && (
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3">Vehicle Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{profile.vehicle.type === "BAJAJ" ? "🛺 Bajaj" : "🛵 Motorcycle"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plate Number</span>
                <span className="font-medium">{profile.vehicle.plateNumber}</span>
              </div>
              {profile.vehicle.model && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium">{profile.vehicle.model}</span>
                </div>
              )}
              {profile.vehicle.color && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Color</span>
                  <span className="font-medium">{profile.vehicle.color}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verification Document */}
        {profile.document && (
          <div className="p-4 rounded-xl border bg-card">
            <h3 className="font-semibold mb-3">Verification Document</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type</span>
                <span className="font-medium">{profile.document.type.replace("_", " ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number</span>
                <span className="font-medium">{profile.document.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getDocStatusBadge(profile.document.status)}`}>
                  {profile.document.status}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="p-4 rounded-xl border bg-card text-center text-sm text-muted-foreground">
          Member since {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </div>
      </div>
    </main>
  );
}
