export default function Loading() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
        <p className="text-muted-foreground">Loading trip details...</p>
      </div>
    </main>
  );
}
