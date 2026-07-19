"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DriverLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Login failed"); return; }
      localStorage.setItem("ubar_driver", JSON.stringify(data.data));
      router.push("/dashboard");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="text-4xl font-bold text-primary">UBAR</Link>
          <p className="text-sm text-muted-foreground">Driver Portal</p>
          <h2 className="text-2xl font-semibold">Welcome Back, Driver</h2>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input type="tel" placeholder="+252 61 XXX XXXX" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          New driver? <Link href="/auth/register" className="text-primary font-medium hover:underline">Register here</Link>
        </p>
      </div>
    </main>
  );
}
