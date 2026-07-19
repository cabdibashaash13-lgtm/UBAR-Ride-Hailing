"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { LandingToolbar } from "@/components/landing-toolbar";

const cities = ["Mogadishu", "Hargeisa", "Garowe", "Bosaso", "Kismayo", "Baidoa", "Beledweyne", "Jowhar"];

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen relative">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-primary/5 to-background">
        <LandingToolbar />
        <motion.div
          className="max-w-lg w-full text-center space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Logo */}
          <motion.div className="space-y-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
            <h1 className="text-6xl font-bold text-primary">UBAR</h1>
            <p className="text-xl text-muted-foreground">
              Somalia&apos;s Ride-Hailing App
            </p>
          </motion.div>

          {/* Vehicle Icons */}
          <motion.div className="flex justify-center gap-8 text-5xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <motion.span title="Bajaj" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }}>🛺</motion.span>
            <motion.span title="Motorcycle" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}>🛵</motion.span>
          </motion.div>

          {/* Description */}
          <motion.p className="text-lg text-muted-foreground max-w-md mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            Book Bajaj and Motorcycle rides across Somalia. Fast, affordable, and reliable transportation at your fingertips.
          </motion.p>

          {/* Cities */}
          <motion.div className="flex flex-wrap justify-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {cities.map((city, i) => (
              <motion.span
                key={city}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm"
              >
                {city}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center pt-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
            <Link href="/auth/login" className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg">
              Login
            </Link>
            <Link href="/auth/register" className="px-8 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-lg hover:bg-primary/5 transition-colors">
              Create Account
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer className="border-t py-6 px-4 text-center text-sm text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
        <div className="flex justify-center gap-6 mb-2">
          <Link href="https://driver.localhost:3002" className="hover:text-primary transition-colors">Driver Portal</Link>
          <Link href="https://admin.localhost:3003" className="hover:text-primary transition-colors">Admin Panel</Link>
        </div>
        <p>&copy; 2026 UBAR. Made for Somalia.</p>
      </motion.footer>
    </main>
  );
}
