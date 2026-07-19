# Authentication & User Management

<cite>
**Referenced Files in This Document**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)
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
This document explains the Passenger Application authentication system, focusing on login and registration workflows, Supabase integration patterns, session management, and role-based access control (RBAC). It covers the end-to-end flow from user interface to database validation, including form handling, error states, security measures, provider setup for global authentication state, protected route implementation, and user profile management. Where applicable, code examples are referenced by file paths rather than included inline.

## Project Structure
The Passenger app is a Next.js application with:
- App Router pages for authentication and protected routes
- API route handlers for server-side auth operations
- Supabase client libraries for client and server contexts
- A providers component for global auth state
- Layout configuration for applying providers and middleware behavior

```mermaid
graph TB
subgraph "Passenger App"
UI_Login["auth/login page"]
UI_Register["auth/register page"]
UI_Profile["profile page"]
UI_Home["home page"]
API_Login["api/auth/login route"]
API_Register["api/auth/register route"]
Providers["components/providers.tsx"]
Layout["app/layout.tsx"]
SB_Client["lib/supabase.ts"]
SB_Server["lib/supabase-server.ts"]
end
UI_Login --> API_Login
UI_Register --> API_Register
UI_Profile --> SB_Client
UI_Home --> SB_Client
Providers --> SB_Client
Layout --> Providers
API_Login --> SB_Server
API_Register --> SB_Server
```

**Diagram sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)

**Section sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)

## Core Components
- Authentication Pages
  - Login page handles email/password submission, shows loading and error states, and redirects upon success.
  - Register page collects new user details, validates inputs, submits to the register endpoint, and navigates after successful creation.
- API Route Handlers
  - Login route authenticates credentials via Supabase and returns a standardized response.
  - Register route creates a new user account through Supabase and returns a standardized response.
- Supabase Clients
  - Client-side Supabase instance for browser sessions and real-time features.
  - Server-side Supabase instance for secure API operations using environment variables.
- Global Auth Provider
  - Provides authenticated state and helpers to components and pages.
- Layout
  - Wraps the app with providers and applies consistent layout behavior.

**Section sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)

## Architecture Overview
The authentication architecture follows a clear separation between client and server responsibilities:
- Client-side pages manage forms, local state, and navigation.
- API routes perform credential checks and account creation using the server-side Supabase client.
- The global provider exposes auth state to the UI.
- Protected routes rely on session validity and optionally roles.

```mermaid
sequenceDiagram
participant U as "User"
participant P as "Login Page"
participant A as "API /auth/login"
participant S as "Supabase Server Client"
participant DB as "Supabase Database"
U->>P : "Enter email/password"
P->>A : "POST {email,password}"
A->>S : "signInWithPassword(credentials)"
S->>DB : "Validate credentials"
DB-->>S : "Session + user"
S-->>A : "Auth result"
A-->>P : "{success,user}"
P->>P : "Update global auth state"
P-->>U : "Redirect to dashboard/home"
```

**Diagram sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)

## Detailed Component Analysis

### Login Workflow
- Form Handling
  - Captures email and password, manages loading and error states, and calls the login API route.
- API Handler
  - Validates input, invokes Supabase sign-in, and returns a structured response.
- Session Management
  - On success, updates global auth state and navigates to the appropriate route.
- Error States
  - Displays user-friendly messages for invalid credentials or network errors.

```mermaid
flowchart TD
Start(["Submit Login"]) --> Validate["Validate Inputs"]
Validate --> Valid{"Inputs Valid?"}
Valid -- "No" --> ShowError["Show Validation Errors"]
Valid -- "Yes" --> CallAPI["Call /api/auth/login"]
CallAPI --> Resp{"Response Success?"}
Resp -- "No" --> HandleError["Display Error Message"]
Resp -- "Yes" --> UpdateState["Update Global Auth State"]
UpdateState --> Redirect["Navigate to Home/Dashboard"]
ShowError --> End(["End"])
HandleError --> End
Redirect --> End
```

**Diagram sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)

**Section sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)

### Registration Workflow
- Form Handling
  - Collects required fields (e.g., name, email, password), performs client-side validation, and submits to the register API route.
- API Handler
  - Creates a new user via Supabase and returns a standardized response.
- Post-Registration Behavior
  - Updates global auth state and navigates to the home or onboarding page.
- Security Measures
  - Enforces password strength and email format; avoids exposing internal errors to clients.

```mermaid
sequenceDiagram
participant U as "User"
participant R as "Register Page"
participant AR as "API /auth/register"
participant SS as "Supabase Server Client"
participant DB as "Supabase Database"
U->>R : "Fill registration form"
R->>AR : "POST {name,email,password}"
AR->>SS : "signUp(credentials)"
SS->>DB : "Create user"
DB-->>SS : "User + session"
SS-->>AR : "Auth result"
AR-->>R : "{success,user}"
R->>R : "Update global auth state"
R-->>U : "Redirect to home/onboarding"
```

**Diagram sources**
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)

**Section sources**
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)

### Supabase Integration Patterns
- Client-Side Usage
  - Browser-based sessions, real-time subscriptions, and direct queries from the UI.
- Server-Side Usage
  - Secure API operations using environment variables and server-only client initialization.
- Best Practices
  - Keep secrets out of the client bundle.
  - Use typed responses and centralized error mapping.

```mermaid
classDiagram
class SupabaseClient {
+client()
+getSession()
+onAuthChange(callback)
}
class SupabaseServerClient {
+serverClient()
+getUserFromRequest(req)
}
class AuthProvider {
+user
+session
+login(email,password)
+register(data)
+logout()
}
AuthProvider --> SupabaseClient : "uses"
SupabaseServerClient <.. AuthProvider : "used by API routes"
```

**Diagram sources**
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)

**Section sources**
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)

### Global Authentication Provider
- Responsibilities
  - Initialize and expose user/session state.
  - Provide login, register, and logout methods.
  - Persist session across refreshes.
- Integration
  - Wrapped by the root layout to make auth available app-wide.

```mermaid
sequenceDiagram
participant L as "Layout"
participant P as "AuthProvider"
participant SC as "Supabase Client"
L->>P : "Wrap children"
P->>SC : "Initialize client"
P->>SC : "Restore session"
SC-->>P : "Current session/user"
P-->>L : "Provide auth context"
```

**Diagram sources**
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

**Section sources**
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)

### Protected Routes and Role-Based Access Control (RBAC)
- Protection Strategy
  - Guard routes by checking session existence and redirecting unauthenticated users.
- RBAC Implementation
  - Read user role from session metadata or user profile.
  - Deny access if the current role does not match the required role.
- Example Scenarios
  - Passenger-only routes: require passenger role.
  - Admin-only routes: require admin role.

```mermaid
flowchart TD
Enter(["Access Protected Route"]) --> CheckSession["Check Session"]
CheckSession --> HasSession{"Has Session?"}
HasSession -- "No" --> RedirectAuth["Redirect to Login"]
HasSession -- "Yes" --> CheckRole["Check Required Role"]
CheckRole --> RoleOK{"Role Matches?"}
RoleOK -- "No" --> Deny["Deny Access / Redirect"]
RoleOK -- "Yes" --> Allow["Render Protected Content"]
RedirectAuth --> End(["End"])
Deny --> End
Allow --> End
```

[No sources needed since this diagram shows conceptual workflow, not actual code structure]

### User Profile Management
- Reading Profile
  - Fetch user profile data from Supabase using the authenticated session.
- Updating Profile
  - Submit changes via API or direct Supabase update, ensuring proper validation and error handling.
- Displaying Profile
  - Render user info and allow editing within protected routes.

```mermaid
sequenceDiagram
participant U as "User"
participant Prof as "Profile Page"
participant SC as "Supabase Client"
participant DB as "Supabase Database"
U->>Prof : "Open Profile"
Prof->>SC : "Get current user/profile"
SC->>DB : "Query profile"
DB-->>SC : "Profile data"
SC-->>Prof : "Profile object"
Prof-->>U : "Display profile"
U->>Prof : "Edit and Save"
Prof->>SC : "Update profile"
SC->>DB : "Persist changes"
DB-->>SC : "Success"
SC-->>Prof : "Updated profile"
Prof-->>U : "Show confirmation"
```

**Diagram sources**
- [passenger/src/app/profile/page.tsx](file://apps/passenger/src/app/profile/page.tsx)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

**Section sources**
- [passenger/src/app/profile/page.tsx](file://apps/passenger/src/app/profile/page.tsx)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)

## Dependency Analysis
The authentication subsystem depends on:
- UI layers for user interaction
- API routes for secure operations
- Supabase clients for session and data access
- Providers for global state distribution

```mermaid
graph LR
LoginUI["Login Page"] --> LoginAPI["/api/auth/login"]
RegisterUI["Register Page"] --> RegisterAPI["/api/auth/register"]
ProfileUI["Profile Page"] --> SupabaseClient["Supabase Client"]
LoginAPI --> SupabaseServer["Supabase Server Client"]
RegisterAPI --> SupabaseServer
Providers["AuthProvider"] --> SupabaseClient
Layout["Root Layout"] --> Providers
```

**Diagram sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)

**Section sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/lib/supabase.ts](file://apps/passenger/src/lib/supabase.ts)
- [passenger/src/lib/supabase-server.ts](file://apps/passenger/src/lib/supabase-server.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)
- [passenger/src/app/layout.tsx](file://apps/passenger/src/app/layout.tsx)

## Performance Considerations
- Minimize re-renders by memoizing auth state and avoiding unnecessary reinitialization of Supabase clients.
- Batch profile updates and debounce rapid edits.
- Use server-side validation to reduce round trips and improve security.
- Cache frequently accessed profile data where appropriate.

[No sources needed since this section provides general guidance]

## Troubleshooting Guide
Common issues and resolutions:
- Invalid Credentials
  - Ensure correct email/password and check API error responses.
- Network Errors
  - Verify environment variables and network connectivity.
- Session Not Persisted
  - Confirm provider initialization and that the client is used correctly in the browser.
- Unauthorized Access
  - Review RBAC checks and ensure roles are set and validated.

**Section sources**
- [passenger/src/app/auth/login/page.tsx](file://apps/passenger/src/app/auth/login/page.tsx)
- [passenger/src/app/auth/register/page.tsx](file://apps/passenger/src/app/auth/register/page.tsx)
- [passenger/src/app/api/auth/login/route.ts](file://apps/passenger/src/app/api/auth/login/route.ts)
- [passenger/src/app/api/auth/register/route.ts](file://apps/passenger/src/app/api/auth/register/route.ts)
- [passenger/src/components/providers.tsx](file://apps/passenger/src/components/providers.tsx)

## Conclusion
The Passenger Application’s authentication system integrates Supabase securely across client and server contexts, providing robust login and registration flows, session management, and RBAC. By centralizing auth state in a provider and enforcing protection at both route and API levels, the system ensures a secure and maintainable user experience.