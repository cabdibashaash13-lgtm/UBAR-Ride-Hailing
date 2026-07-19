# Passenger Application

<cite>
**Referenced Files in This Document**
- [layout.tsx](file://apps/passenger/src/app/layout.tsx)
- [page.tsx](file://apps/passenger/src/app/page.tsx)
- [error.tsx](file://apps/passenger/src/app/error.tsx)
- [providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [landing-toolbar.tsx](file://apps/passenger/src/components/landing-toolbar.tsx)
- [animations.tsx](file://apps/passenger/src/components/animations.tsx)
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [home/loading.tsx](file://apps/passenger/src/app/home/loading.tsx)
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)
- [trip/[id]/loading.tsx](file://apps/passenger/src/app/trip/[id]/loading.tsx)
- [trip/[id]/rate/page.tsx](file://apps/passenger/src/app/trip/[id]/rate/page.tsx)
- [history/page.tsx](file://apps/passenger/src/app/history/page.tsx)
- [profile/page.tsx](file://apps/passenger/src/app/profile/page.tsx)
- [auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [api/trips/[id]/route.ts](file://apps/passenger/src/app/api/trips/[id]/route.ts)
- [api/trips/[id]/cancel/route.ts](file://apps/passenger/src/app/api/trips/[id]/cancel/route.ts)
- [api/trips/[id]/rate/route.ts](file://apps/passenger/src/app/api/trips/[id]/rate/route.ts)
- [api/trips/history/route.ts](file://apps/passenger/src/app/api/trips/history/route.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [lib/prisma.ts](file://apps/passenger/src/lib/prisma.ts)
</cite>

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)

## Introduction
This document provides comprehensive documentation for the Passenger Application, the primary booking interface for ride-sharing passengers. It covers user interface components, trip booking workflow, real-time tracking implementation, payment processing integration, and driver discovery system. It also explains authentication flow, route protection, state management patterns, API integrations, home page functionality, trip request handling, nearby driver search algorithms, live location tracking, rating system, and payment gateway integration. Responsive design considerations, performance optimization, and error handling strategies are addressed throughout.

## Project Structure
The Passenger Application is a Next.js app with:
- App Router pages under src/app for routes such as auth, home, trip details, history, profile, and API endpoints under src/app/api.
- Shared UI and providers under src/components.
- Client and server libraries for Supabase and Prisma under src/lib.

```mermaid
graph TB
subgraph "Passenger App"
A["src/app/layout.tsx"] --> B["src/app/page.tsx"]
B --> C["src/app/home/page.tsx"]
B --> D["src/app/auth/login/page.tsx"]
B --> E["src/app/auth/register/page.tsx"]
C --> F["src/app/trip/[id]/page.tsx"]
F --> G["src/app/trip/[id]/rate/page.tsx"]
C --> H["src/app/history/page.tsx"]
C --> I["src/app/profile/page.tsx"]
J["src/components/providers.tsx"] --> C
J --> F
K["src/components/landing-toolbar.tsx"] --> C
L["src/components/animations.tsx"] --> C
end
subgraph "API Routes"
M["src/app/api/auth/login/route.ts"]
N["src/app/api/auth/register/route.ts"]
O["src/app/api/drivers/nearby/route.ts"]
P["src/app/api/trips/request/route.ts"]
Q["src/app/api/trips/[id]/route.ts"]
R["src/app/api/trips/[id]/cancel/route.ts"]
S["src/app/api/trips/[id]/rate/route.ts"]
T["src/app/api/trips/history/route.ts"]
U["src/app/api/payments/route.ts"]
end
C --> O
C --> P
F --> Q
F --> R
G --> S
H --> T
I --> U
```

**Diagram sources**
- [layout.tsx](file://apps/passenger/src/app/layout.tsx)
- [page.tsx](file://apps/passenger/src/app/page.tsx)
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)
- [trip/[id]/rate/page.tsx](file://apps/passenger/src/app/trip/[id]/rate/page.tsx)
- [history/page.tsx](file://apps/passenger/src/app/history/page.tsx)
- [profile/page.tsx](file://apps/passenger/src/app/profile/page.tsx)
- [auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [api/trips/[id]/route.ts](file://apps/passenger/src/app/api/trips/[id]/route.ts)
- [api/trips/[id]/cancel/route.ts](file://apps/passenger/src/app/api/trips/[id]/cancel/route.ts)
- [api/trips/[id]/rate/route.ts](file://apps/passenger/src/app/api/trips/[id]/rate/route.ts)
- [api/trips/history/route.ts](file://apps/passenger/src/app/api/trips/history/route.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)

**Section sources**
- [layout.tsx](file://apps/passenger/src/app/layout.tsx)
- [page.tsx](file://apps/passenger/src/app/page.tsx)
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)
- [trip/[id]/rate/page.tsx](file://apps/passenger/src/app/trip/[id]/rate/page.tsx)
- [history/page.tsx](file://apps/passenger/src/app/history/page.tsx)
- [profile/page.tsx](file://apps/passenger/src/app/profile/page.tsx)
- [auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [api/trips/[id]/route.ts](file://apps/passenger/src/app/api/trips/[id]/route.ts)
- [api/trips/[id]/cancel/route.ts](file://apps/passenger/src/app/api/trips/[id]/cancel/route.ts)
- [api/trips/[id]/rate/route.ts](file://apps/passenger/src/app/api/trips/[id]/rate/route.ts)
- [api/trips/history/route.ts](file://apps/passenger/src/app/api/trips/history/route.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)

## Core Components
- Providers: Centralized context providers for application-wide state and client configuration.
- Landing Toolbar: Navigation and quick actions for authenticated users.
- Animations: Reusable animation utilities to enhance UX during transitions and loading states.
- Error Boundary: Global error handling component to catch rendering errors and display fallback UI.

Key responsibilities:
- Provide consistent layout and global state across pages.
- Offer navigation helpers and common UI elements.
- Ensure graceful degradation on errors.

**Section sources**
- [providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [landing-toolbar.tsx](file://apps/passenger/src/components/landing-toolbar.tsx)
- [animations.tsx](file://apps/passenger/src/components/animations.tsx)
- [error.tsx](file://apps/passenger/src/app/error.tsx)

## Architecture Overview
The Passenger Application follows a client-server architecture using Next.js App Router:
- Client-side pages manage user interactions, local state, and real-time updates via Supabase.
- Server-side API routes handle authentication, business logic, database operations (Prisma), and external integrations (payments).
- Real-time features leverage Supabase subscriptions for live location tracking and trip status updates.

```mermaid
graph TB
Client["Client Pages<br/>home, trip, history, profile"] --> AuthAPI["Auth API<br/>login, register"]
Client --> DriverAPI["Drivers Nearby API"]
Client --> TripAPI["Trips API<br/>request, get, cancel, rate, history"]
Client --> PaymentAPI["Payments API"]
Client --> Supabase["Supabase Client<br/>Realtime + Auth"]
AuthAPI --> DB["Database (Prisma)"]
DriverAPI --> DB
TripAPI --> DB
PaymentAPI --> Gateway["Payment Gateway"]
```

**Diagram sources**
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)
- [history/page.tsx](file://apps/passenger/src/app/history/page.tsx)
- [profile/page.tsx](file://apps/passenger/src/app/profile/page.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [api/trips/[id]/route.ts](file://apps/passenger/src/app/api/trips/[id]/route.ts)
- [api/trips/[id]/cancel/route.ts](file://apps/passenger/src/app/api/trips/[id]/cancel/route.ts)
- [api/trips/[id]/rate/route.ts](file://apps/passenger/src/app/api/trips/[id]/rate/route.ts)
- [api/trips/history/route.ts](file://apps/passenger/src/app/api/trips/history/route.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [lib/prisma.ts](file://apps/passenger/src/lib/prisma.ts)

## Detailed Component Analysis

### Authentication Flow
- Login and Register pages submit credentials to corresponding API routes.
- API routes validate inputs, interact with Supabase Auth, and return session tokens or errors.
- Protected routes check session validity before rendering sensitive content.

```mermaid
sequenceDiagram
participant User as "User"
participant Page as "Login Page"
participant API as "Auth Login API"
participant SB as "Supabase Auth"
participant Store as "Global State"
User->>Page : "Enter email/password"
Page->>API : "POST /api/auth/login"
API->>SB : "signInWithPassword"
SB-->>API : "Session or error"
API-->>Page : "Success or error response"
Page->>Store : "Persist session/state"
Page-->>User : "Redirect to Home"
```

**Diagram sources**
- [auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [providers.tsx](file://apps/passenger/src/components/providers.tsx)

**Section sources**
- [auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [providers.tsx](file://apps/passenger/src/components/providers.tsx)

### Route Protection
- Layout and page-level guards verify authentication state before allowing access.
- Redirect unauthenticated users to login when accessing protected routes like Home, History, Profile, and active trips.

```mermaid
flowchart TD
Start(["Navigate to Protected Route"]) --> CheckAuth["Check Session/Auth State"]
CheckAuth --> IsAuth{"Authenticated?"}
IsAuth --> |Yes| Render["Render Page Content"]
IsAuth --> |No| Redirect["Redirect to Login"]
Render --> End(["Done"])
Redirect --> End
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

### Home Page Functionality
- Displays pickup and dropoff inputs, fare estimation, and nearby drivers list.
- Initiates trip requests and manages real-time updates for driver matching and arrival.
- Uses animations for smooth transitions and loading indicators.

```mermaid
sequenceDiagram
participant User as "User"
participant Home as "Home Page"
participant DriversAPI as "Drivers Nearby API"
participant TripsAPI as "Trips Request API"
participant SB as "Supabase Realtime"
User->>Home : "Set pickup/dropoff"
Home->>DriversAPI : "GET /api/drivers/nearby"
DriversAPI-->>Home : "List of nearby drivers"
User->>Home : "Request trip"
Home->>TripsAPI : "POST /api/trips/request"
TripsAPI-->>Home : "Trip created"
Home->>SB : "Subscribe to trip updates"
SB-->>Home : "Live driver location/status"
Home-->>User : "Show driver ETA and progress"
```

**Diagram sources**
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [animations.tsx](file://apps/passenger/src/components/animations.tsx)

**Section sources**
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [home/loading.tsx](file://apps/passenger/src/app/home/loading.tsx)
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [animations.tsx](file://apps/passenger/src/components/animations.tsx)

### Nearby Driver Search Algorithm
- The nearby drivers endpoint computes distance between passenger coordinates and available drivers.
- Filters drivers within a radius threshold and sorts by proximity.
- Returns minimal driver metadata for efficient client rendering.

```mermaid
flowchart TD
Start(["Receive passenger lat/lng"]) --> FetchDrivers["Query available drivers"]
FetchDrivers --> ComputeDist["Compute distances"]
ComputeDist --> FilterRadius{"Within radius?"}
FilterRadius --> |No| Exclude["Exclude driver"]
FilterRadius --> |Yes| Include["Include driver"]
Include --> Sort["Sort by distance"]
Exclude --> Next["Next driver"]
Sort --> Return["Return sorted list"]
Next --> ComputeDist
Return --> End(["Done"])
```

**Diagram sources**
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)

**Section sources**
- [api/drivers/nearby/route.ts](file://apps/passenger/src/app/api/drivers/nearby/route.ts)

### Trip Request Handling
- Validates pickup and dropoff locations, calculates estimated fare, and creates a trip record.
- Notifies drivers and subscribes to real-time updates for status changes.
- Handles cancellation and completion flows through dedicated API endpoints.

```mermaid
sequenceDiagram
participant Home as "Home Page"
participant TripsAPI as "Trips Request API"
participant DB as "Database"
participant SB as "Supabase Realtime"
participant Driver as "Driver App"
Home->>TripsAPI : "POST /api/trips/request"
TripsAPI->>DB : "Create trip record"
DB-->>TripsAPI : "Trip ID"
TripsAPI-->>Home : "Trip created"
Home->>SB : "Subscribe to trip updates"
SB-->>Home : "Status : driver matched/en-route/picked-up/completed"
Note over Driver,TripsAPI : "Driver accepts trip via driver app"
```

**Diagram sources**
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [api/trips/[id]/route.ts](file://apps/passenger/src/app/api/trips/[id]/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

**Section sources**
- [api/trips/request/route.ts](file://apps/passenger/src/app/api/trips/request/route.ts)
- [api/trips/[id]/route.ts](file://apps/passenger/src/app/api/trips/[id]/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

### Live Location Tracking
- Subscribes to driver location updates via Supabase Realtime channels.
- Updates map markers and ETA calculations on the client side.
- Debounces frequent updates to optimize performance.

```mermaid
sequenceDiagram
participant TripPage as "Trip Detail Page"
participant SB as "Supabase Realtime"
participant Map as "Map Component"
TripPage->>SB : "Subscribe to trip.location channel"
SB-->>TripPage : "Driver location events"
TripPage->>Map : "Update marker position"
Map-->>TripPage : "Re-render with new position"
```

**Diagram sources**
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

**Section sources**
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)
- [trip/[id]/loading.tsx](file://apps/passenger/src/app/trip/[id]/loading.tsx)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

### Rating System
- After trip completion, passengers can rate their driver via the rating page.
- Submission calls the rate endpoint, which persists the rating and updates trip metadata.

```mermaid
sequenceDiagram
participant User as "User"
participant RatePage as "Rate Page"
participant RateAPI as "Rate API"
participant DB as "Database"
User->>RatePage : "Submit rating and feedback"
RatePage->>RateAPI : "POST /api/trips/[id]/rate"
RateAPI->>DB : "Save rating"
DB-->>RateAPI : "Success"
RateAPI-->>RatePage : "Confirmation"
RatePage-->>User : "Thank you message"
```

**Diagram sources**
- [trip/[id]/rate/page.tsx](file://apps/passenger/src/app/trip/[id]/rate/page.tsx)
- [api/trips/[id]/rate/route.ts](file://apps/passenger/src/app/api/trips/[id]/rate/route.ts)

**Section sources**
- [trip/[id]/rate/page.tsx](file://apps/passenger/src/app/trip/[id]/rate/page.tsx)
- [api/trips/[id]/rate/route.ts](file://apps/passenger/src/app/api/trips/[id]/rate/route.ts)

### Payment Processing Integration
- Payments endpoint orchestrates charge creation, confirmation, and receipt generation.
- Integrates with an external payment gateway and stores transaction records.
- Provides idempotency keys to prevent duplicate charges.

```mermaid
sequenceDiagram
participant Profile as "Profile Page"
participant PayAPI as "Payments API"
participant Gateway as "Payment Gateway"
participant DB as "Database"
Profile->>PayAPI : "POST /api/payments"
PayAPI->>Gateway : "Create charge"
Gateway-->>PayAPI : "Charge result"
PayAPI->>DB : "Record transaction"
DB-->>PayAPI : "Transaction saved"
PayAPI-->>Profile : "Payment success/failure"
```

**Diagram sources**
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)

**Section sources**
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)

### Cancel and History Flows
- Cancellation endpoint updates trip status and triggers refunds if applicable.
- History endpoint retrieves past trips for the authenticated passenger.

```mermaid
sequenceDiagram
participant TripPage as "Trip Detail Page"
participant CancelAPI as "Cancel API"
participant HistoryAPI as "History API"
participant DB as "Database"
TripPage->>CancelAPI : "POST /api/trips/[id]/cancel"
CancelAPI->>DB : "Update trip status"
DB-->>CancelAPI : "Updated"
CancelAPI-->>TripPage : "Cancellation confirmed"
HistoryAPI->>DB : "Fetch past trips"
DB-->>HistoryAPI : "Trip list"
HistoryAPI-->>History Page : "Display history"
```

**Diagram sources**
- [api/trips/[id]/cancel/route.ts](file://apps/passenger/src/app/api/trips/[id]/cancel/route.ts)
- [api/trips/history/route.ts](file://apps/passenger/src/app/api/trips/history/route.ts)

**Section sources**
- [api/trips/[id]/cancel/route.ts](file://apps/passenger/src/app/api/trips/[id]/cancel/route.ts)
- [api/trips/history/route.ts](file://apps/passenger/src/app/api/trips/history/route.ts)
- [history/page.tsx](file://apps/passenger/src/app/history/page.tsx)

### State Management Patterns
- Global state provider centralizes user session, trip state, and UI flags.
- Local component state handles form inputs and transient UI behavior.
- Real-time subscriptions update state reactively without polling.

```mermaid
classDiagram
class Providers {
+session
+tripState
+uiFlags
+updateSession()
+setTripState()
}
class HomePage {
+pickup
+dropoff
+requestTrip()
}
class TripDetailPage {
+tripId
+subscribeUpdates()
}
Providers <.. HomePage : "consumes"
Providers <.. TripDetailPage : "consumes"
```

**Diagram sources**
- [providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)

**Section sources**
- [providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [home/page.tsx](file://apps/passenger/src/app/home/page.tsx)
- [trip/[id]/page.tsx](file://apps/passenger/src/app/trip/[id]/page.tsx)

## Dependency Analysis
The Passenger Application depends on:
- Supabase for authentication and real-time capabilities.
- Prisma for database schema and queries.
- External payment gateway for transactions.

```mermaid
graph TB
Pages["Pages & Components"] --> Supabase["Supabase Client"]
Pages --> Prisma["Prisma Client"]
API["API Routes"] --> Supabase
API --> Prisma
API --> PaymentGateway["Payment Gateway"]
```

**Diagram sources**
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [lib/prisma.ts](file://apps/passenger/src/lib/prisma.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)

**Section sources**
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [lib/prisma.ts](file://apps/passenger/src/lib/prisma.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)

## Performance Considerations
- Debounce real-time location updates to reduce re-renders.
- Use pagination for trip history and large datasets.
- Optimize images and assets; leverage Next.js image optimization.
- Minimize network requests by batching API calls where possible.
- Implement optimistic UI updates for better perceived performance.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and strategies:
- Authentication failures: Verify credentials and session persistence; check API responses for detailed errors.
- Real-time connection drops: Implement reconnection logic and fallback to polling temporarily.
- Payment errors: Inspect gateway responses, ensure idempotency keys are used, and log transaction IDs.
- Route protection bypass: Ensure guards run on both client and server sides.

**Section sources**
- [error.tsx](file://apps/passenger/src/app/error.tsx)
- [api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [api/payments/route.ts](file://apps/passenger/src/app/api/payments/route.ts)
- [lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

## Conclusion
The Passenger Application provides a robust, real-time booking experience with clear separation between client and server concerns. Authentication, driver discovery, trip management, ratings, and payments are implemented via well-defined API routes and integrated with Supabase and Prisma. By following the patterns outlined here—state management, real-time subscriptions, and resilient error handling—the application delivers a responsive and reliable user experience.