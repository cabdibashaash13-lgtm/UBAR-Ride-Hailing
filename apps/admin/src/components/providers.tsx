"use client";
import { ThemeProvider, ToastContainer } from "@ubar/shared-ui";
import { I18nProvider } from "@ubar/shared-ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <I18nProvider defaultLang="en">
        {children}
        <ToastContainer />
      </I18nProvider>
    </ThemeProvider>
  );
}
