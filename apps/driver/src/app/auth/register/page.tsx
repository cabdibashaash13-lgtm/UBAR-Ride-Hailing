"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DriverRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "", phone: "", vehicleType: "BAJAJ", plateNumber: "",
    vehicleModel: "", vehicleColor: "", vehicleYear: "",
    documentType: "NATIONAL_ID", documentNumber: "", documentPhotoUrl: "https://placeholder.co/id-photo.jpg",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const update = (field: string, value: string) => setForm({ ...form, [field]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Registration failed"); return; }
      setSuccess(true);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <main className="flex flex-col min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold">Registration Submitted!</h2>
          <p className="text-muted-foreground">
            Your application is pending admin review. We&apos;ll notify you once approved.
          </p>
          <Link href="/auth/login" className="text-primary font-medium hover:underline">Go to Login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-4 py-8 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="text-4xl font-bold text-primary">UBAR</Link>
          <h2 className="text-2xl font-semibold">Register as Driver</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <input type="text" value={form.fullName} onChange={(e) => update("fullName", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <input type="tel" placeholder="+252 61 XXX XXXX" value={form.phone} onChange={(e) => update("phone", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Vehicle Type</label>
            <div className="flex gap-3">
              {(["BAJAJ", "MOTORCYCLE"] as const).map((v) => (
                <button key={v} type="button" onClick={() => update("vehicleType", v)}
                  className={`flex-1 p-3 rounded-xl border-2 text-center cursor-pointer ${form.vehicleType === v ? "border-primary bg-primary/5" : "border-border"}`}>
                  <span className="text-2xl">{v === "BAJAJ" ? "🛺" : "🛵"}</span>
                  <p className="text-sm mt-1">{v === "BAJAJ" ? "Bajaj" : "Motorcycle"}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Plate Number</label>
            <input type="text" placeholder="e.g. MGD-001" value={form.plateNumber} onChange={(e) => update("plateNumber", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <input type="text" placeholder="e.g. Piaggio" value={form.vehicleModel} onChange={(e) => update("vehicleModel", e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Color</label>
              <input type="text" placeholder="e.g. Green" value={form.vehicleColor} onChange={(e) => update("vehicleColor", e.target.value)}
                className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ID Type</label>
            <select value={form.documentType} onChange={(e) => update("documentType", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <option value="NATIONAL_ID">National ID</option>
              <option value="NIRA">NIRA Card</option>
              <option value="PASSPORT">Passport</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">ID Number</label>
            <input type="text" placeholder="Your ID number" value={form.documentNumber} onChange={(e) => update("documentNumber", e.target.value)}
              className="flex h-11 w-full rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          </div>

          <button type="submit" disabled={loading}
            className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already registered? <Link href="/auth/login" className="text-primary font-medium hover:underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
