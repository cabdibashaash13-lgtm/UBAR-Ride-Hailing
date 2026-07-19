import Link from "next/link";
import { LandingToolbar } from "@/components/landing-toolbar";

export default function DriverLanding() {
  return (
    <main className="flex flex-col min-h-screen relative">
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-primary/5 to-background">
        <LandingToolbar />
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-primary">UBAR</h1>
            <p className="text-xl text-muted-foreground">Driver Portal</p>
          </div>
          <div className="flex justify-center gap-8 text-5xl">
            <span>🛺</span>
            <span>🛵</span>
          </div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Earn money driving Bajaj or Motorcycle. Join Somalia&apos;s growing ride-hailing network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/auth/login" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg">
              Driver Login
            </Link>
            <Link href="/auth/register" className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/5 transition-colors">
              Register as Driver
            </Link>
          </div>
        </div>
      </div>
      <footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground">
        <p>&copy; 2026 UBAR Driver. Made for Somalia.</p>
      </footer>
    </main>
  );
}
