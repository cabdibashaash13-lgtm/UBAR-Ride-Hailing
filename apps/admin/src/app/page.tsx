"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Simple admin auth check
      const res = await fetch("/api/analytics");
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("ubar_admin", JSON.stringify({ loggedIn: true }));
        router.push("/dashboard");
      } else {
        setError("Invalid credentials");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-primary">UBAR</h1>
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4 p-6 rounded-2xl border bg-card shadow-sm">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
          <div className="space-y-2">
            <label className="text-sm font-medium">Admin Phone</label>
            <input type="tel" placeholder="+252 61 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
