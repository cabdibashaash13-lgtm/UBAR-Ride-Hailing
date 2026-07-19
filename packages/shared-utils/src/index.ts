// ─── PRICE CALCULATOR ─────────────────────────────────────

import { VehicleType, Currency, FareEstimate } from "@ubar/shared-types";

const DEFAULT_RATES = {
  [VehicleType.BAJAJ]: { baseFare: 2.0, perKm: 0.5, minFare: 2.0 },
  [VehicleType.MOTORCYCLE]: { baseFare: 1.5, perKm: 0.35, minFare: 1.5 },
};

export function calculateFare(
  vehicleType: VehicleType,
  distanceKm: number,
  rates?: { baseFare?: number; perKm?: number; minFare?: number }
): FareEstimate {
  const defaults = DEFAULT_RATES[vehicleType];
  const baseFare = rates?.baseFare ?? defaults.baseFare;
  const perKm = rates?.perKm ?? defaults.perKm;
  const minFare = rates?.minFare ?? defaults.minFare;

  const rawFare = baseFare + perKm * distanceKm;
  const estimatedFare = Math.max(rawFare, minFare);
  const estimatedDurationMinutes = Math.round(distanceKm * 3 + 5);

  return {
    baseFare,
    perKmRate: perKm,
    distanceKm: Math.round(distanceKm * 100) / 100,
    estimatedFare: Math.round(estimatedFare * 100) / 100,
    currency: Currency.USD,
    estimatedDurationMinutes,
  };
}

export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency,
  exchangeRate: number = 25000
): number {
  if (from === to) return amount;
  if (from === Currency.USD && to === Currency.SOS) return Math.round(amount * exchangeRate);
  if (from === Currency.SOS && to === Currency.USD) return Math.round((amount / exchangeRate) * 100) / 100;
  return amount;
}

// ─── DISTANCE CALCULATOR ──────────────────────────────────

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// ─── VALIDATION ───────────────────────────────────────────

export function isValidSomaliPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  return /^\+252\d{9}$/.test(cleaned) || /^0\d{8,9}$/.test(cleaned);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+252")) return cleaned;
  if (cleaned.startsWith("0")) return "+252" + cleaned.substring(1);
  return cleaned;
}

export function isValidIdNumber(idType: string, idNumber: string): boolean {
  if (!idNumber || idNumber.length < 5) return false;
  return /^[A-Za-z0-9\-]+$/.test(idNumber);
}

// ─── FORMATTERS ───────────────────────────────────────────

export function formatCurrency(amount: number, currency: Currency = Currency.USD): string {
  if (currency === Currency.SOS) {
    return `${amount.toLocaleString()} SOS`;
  }
  return `$${amount.toFixed(2)}`;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)}m`;
  return `${km.toFixed(1)} km`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}m`;
}

// ─── HELPERS ──────────────────────────────────────────────

export function getVehicleEmoji(vehicleType: VehicleType): string {
  return vehicleType === VehicleType.BAJAJ ? "🛺" : "🛵";
}

export function getVehicleLabel(vehicleType: VehicleType): string {
  return vehicleType === VehicleType.BAJAJ ? "Bajaj" : "Motorcycle";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    REQUESTED: "yellow",
    ACCEPTED: "blue",
    IN_PROGRESS: "purple",
    COMPLETED: "green",
    CANCELLED: "red",
    PENDING: "yellow",
    APPROVED: "green",
    REJECTED: "red",
    BLOCKED: "red",
  };
  return colors[status] || "gray";
}

export function getStarsArray(rating: number, max: number = 5): boolean[] {
  return Array.from({ length: max }, (_, i) => i < Math.round(rating));
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + "...";
}

export function generateOTP(length: number = 6): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

// ─── I18N ────────────────────────────────────────────────

export { t, tWithParams } from "./i18n";
export type { Language } from "./i18n";
