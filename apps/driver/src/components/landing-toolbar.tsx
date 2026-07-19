"use client";
import { LanguageSwitcher, ThemeToggle } from "@ubar/shared-ui";

export function LandingToolbar() {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <LanguageSwitcher />
      <ThemeToggle />
    </div>
  );
}
