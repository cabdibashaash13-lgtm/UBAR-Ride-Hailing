"use client";
import { useState, useEffect } from "react";

interface Passenger {
  id: string; fullName: string; phone: string; createdAt: string; totalTrips: number;
}

export default function PassengersPage() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/passengers")
      .then((r) => r.json())
      .then((data) => { if (data.success) setPassengers(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = passengers.filter((p) =>
    p.fullName.toLowerCase().includes(search.toLowerCase()) || p.phone.includes(search)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Passengers</h1>
        <p className="text-sm text-muted-foreground">{passengers.length} passengers registered</p>
      </div>

      <div>
        <input type="text" placeholder="Search by name or phone..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex h-11 w-full max-w-sm rounded-lg border border-input bg-transparent px-3 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>

      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">No passengers found</p>
      ) : (
        <div className="border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">Passenger</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Total Trips</th>
                  <th className="text-left px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                          {p.fullName.charAt(0)}
                        </div>
                        <span className="font-medium">{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.phone}</td>
                    <td className="px-4 py-3">{p.totalTrips}</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</td>
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
