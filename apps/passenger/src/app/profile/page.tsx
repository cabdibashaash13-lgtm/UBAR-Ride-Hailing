"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PassengerProfile {
  id: string; fullName: string; phone: string; createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<PassengerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ubar_passenger");
    if (!stored) { router.push("/auth/login"); return; }
    setProfile(JSON.parse(stored));
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("ubar_passenger");
    router.push("/");
  };

  if (loading || !profile) return <main className="flex items-center justify-center min-h-screen"><p className="text-muted-foreground">Loading...</p></main>;

  return (
    <main className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <Link href="/home" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-lg font-bold">My Profile</h1>
        <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive cursor-pointer">Logout</button>
      </header>
      <div className="flex-1 p-4 space-y-4">
        <div className="p-6 rounded-xl border bg-card text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
            {profile.fullName.charAt(0)}
          </div>
          <h2 className="text-xl font-bold">{profile.fullName}</h2>
          <p className="text-sm text-muted-foreground">{profile.phone}</p>
        </div>
        <div className="p-4 rounded-xl border bg-card">
          <h3 className="font-semibold mb-3">Account Info</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{profile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span className="font-medium">{new Date(profile.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <Link href="/history" className="block p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-medium">Trip History</span>
              <span className="text-muted-foreground">&rarr;</span>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
