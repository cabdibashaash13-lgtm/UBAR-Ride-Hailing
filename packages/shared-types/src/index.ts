// ─── ENUMS ────────────────────────────────────────────────

export enum UserRole {
  PASSENGER = "PASSENGER",
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
}

export enum VehicleType {
  BAJAJ = "BAJAJ",
  MOTORCYCLE = "MOTORCYCLE",
}

export enum DriverStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  BLOCKED = "BLOCKED",
}

export enum TripStatus {
  REQUESTED = "REQUESTED",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  EVC_PLUS = "EVC_PLUS",
  SAHAL = "SAHAL",
  EDAHAB = "EDAHAB",
  KAAH = "KAAH",
  CASH = "CASH",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum Currency {
  SOS = "SOS",
  USD = "USD",
}

export enum DocumentType {
  NATIONAL_ID = "NATIONAL_ID",
  NIRA = "NIRA",
  PASSPORT = "PASSPORT",
}

export enum DocumentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum NotificationType {
  RIDE_REQUEST = "RIDE_REQUEST",
  RIDE_ACCEPTED = "RIDE_ACCEPTED",
  RIDE_STARTED = "RIDE_STARTED",
  RIDE_COMPLETED = "RIDE_COMPLETED",
  RIDE_CANCELLED = "RIDE_CANCELLED",
  PAYMENT = "PAYMENT",
  SYSTEM = "SYSTEM",
}

// ─── API TYPES ────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ─── AUTH TYPES ───────────────────────────────────────────

export interface RegisterPassengerRequest {
  fullName: string;
  phone: string;
  password?: string;
  cityId?: string;
}

export interface RegisterDriverRequest {
  fullName: string;
  phone: string;
  password?: string;
  photoUrl?: string;
  vehicleType: VehicleType;
  plateNumber: string;
  vehicleModel?: string;
  vehicleColor?: string;
  vehicleYear?: number;
  documentType: DocumentType;
  documentNumber: string;
  documentPhotoUrl: string;
}

export interface LoginRequest {
  phone: string;
  password?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

// ─── USER TYPES ───────────────────────────────────────────

export interface UserProfile {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  role: UserRole;
  city?: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  photoUrl?: string;
  email?: string;
  cityId?: string;
}

// ─── DRIVER TYPES ─────────────────────────────────────────

export interface DriverProfile {
  id: string;
  fullName: string;
  phone: string;
  photoUrl?: string;
  status: DriverStatus;
  isOnline: boolean;
  rating: number;
  totalTrips: number;
  totalEarnings: number;
  vehicle: VehicleInfo;
  verification?: VerificationInfo;
}

export interface VehicleInfo {
  id: string;
  type: VehicleType;
  plateNumber: string;
  model?: string;
  color?: string;
  year?: number;
}

export interface VerificationInfo {
  documentType: DocumentType;
  documentNumber: string;
  photoUrl: string;
  status: DocumentStatus;
}

export interface NearbyDriver {
  id: string;
  fullName: string;
  photoUrl?: string;
  rating: number;
  vehicle: VehicleInfo;
  distanceKm: number;
  lat: number;
  lng: number;
}

// ─── TRIP TYPES ───────────────────────────────────────────

export interface CreateTripRequest {
  vehicleType: VehicleType;
  pickupLat: number;
  pickupLng: number;
  pickupAddress?: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffAddress?: string;
  estimatedDistanceKm?: number;
  estimatedDurationMinutes?: number;
}

export interface TripInfo {
  id: string;
  status: TripStatus;
  vehicleType: VehicleType;
  pickupLat: number;
  pickupLng: number;
  pickupAddress?: string;
  dropoffLat?: number;
  dropoffLng?: number;
  dropoffAddress?: string;
  distanceKm?: number;
  durationMinutes?: number;
  fare?: number;
  currency: Currency;
  requestedAt: string;
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  passenger?: UserProfile;
  driver?: DriverProfile;
}

export interface FareEstimate {
  baseFare: number;
  perKmRate: number;
  distanceKm: number;
  estimatedFare: number;
  currency: Currency;
  estimatedDurationMinutes: number;
}

// ─── PAYMENT TYPES ────────────────────────────────────────

export interface CreatePaymentRequest {
  method: PaymentMethod;
  currency?: Currency;
  reference?: string;
}

export interface PaymentInfo {
  id: string;
  method: PaymentMethod;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  paidAt?: string;
}

// ─── RATING TYPES ─────────────────────────────────────────

export interface CreateRatingRequest {
  tripId: string;
  stars: number;
  comment?: string;
}

// ─── EARNING TYPES ────────────────────────────────────────

export interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  totalTrips: number;
  currency: Currency;
}

// ─── ADMIN TYPES ──────────────────────────────────────────

export interface AdminDashboardStats {
  totalPassengers: number;
  totalDrivers: number;
  activeDrivers: number;
  pendingDrivers: number;
  activeRides: number;
  completedTrips: number;
  cancelledTrips: number;
  dailyIncome: number;
  monthlyIncome: number;
  popularAreas: { area: string; tripCount: number }[];
}

export interface DriverFilter {
  status?: DriverStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface TripFilter {
  status?: TripStatus;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

// ─── SOCKET EVENT TYPES ───────────────────────────────────

export interface SocketTripRequest {
  tripId: string;
  passengerId: string;
  passengerName: string;
  pickupLat: number;
  pickupLng: number;
  pickupAddress?: string;
  dropoffLat: number;
  dropoffLng: number;
  dropoffAddress?: string;
  vehicleType: VehicleType;
  fare?: number;
}

export interface SocketDriverLocation {
  driverId: string;
  lat: number;
  lng: number;
  heading?: number;
  speed?: number;
  timestamp: number;
}

export interface SocketTripUpdate {
  tripId: string;
  status: TripStatus;
  driverId?: string;
  driverName?: string;
  driverPhoto?: string;
  vehiclePlate?: string;
  driverRating?: number;
  estimatedArrivalMinutes?: number;
}
