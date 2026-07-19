"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-5xl">⚠️</div>
        <h2 className="text-xl font-bold">Something went wrong</h2>
        <p className="text-sm text-muted-foreground">{error.message || "An unexpected error occurred"}</p>
        <button onClick={reset} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 cursor-pointer">
          Try Again
        </button>
      </div>
    </main>
  );
}
