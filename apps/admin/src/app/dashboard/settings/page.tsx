"use client";
import { useState, useEffect } from "react";

interface Setting { id: string; key: string; value: string; label?: string }

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => { if (data.success) setSettings(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateValue = (key: string, value: string) => {
    setSettings(settings.map((s) => (s.key === key ? { ...s, value } : s)));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: settings.map((s) => ({ key: s.key, value: s.value })) }),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const groupedSettings = {
    fares: settings.filter((s) => s.key.includes("fare") || s.key.includes("rate") || s.key.includes("price")),
    general: settings.filter((s) => !s.key.includes("fare") && !s.key.includes("rate") && !s.key.includes("price")),
  };

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading settings...</p></div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 cursor-pointer">
          {saving ? "Saving..." : success ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {success && (
        <div className="p-3 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Fare Settings */}
      {groupedSettings.fares.length > 0 && (
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="font-semibold mb-4">Fare & Pricing</h3>
          <div className="space-y-4">
            {groupedSettings.fares.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label || s.key}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.key}</p>
                </div>
                <input type="text" value={s.value} onChange={(e) => updateValue(s.key, e.target.value)}
                  className="flex h-10 w-32 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* General Settings */}
      {groupedSettings.general.length > 0 && (
        <div className="p-5 rounded-xl border bg-card">
          <h3 className="font-semibold mb-4">General</h3>
          <div className="space-y-4">
            {groupedSettings.general.map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.label || s.key}</p>
                  <p className="text-xs text-muted-foreground font-mono">{s.key}</p>
                </div>
                <input type="text" value={s.value} onChange={(e) => updateValue(s.key, e.target.value)}
                  className="flex h-10 w-32 rounded-lg border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
