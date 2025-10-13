import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/src/components/ThemeProvider"
import { UserProvider } from '@/src/components/providers/UserProvider'

export const metadata: Metadata = {
  title: "FitTrack",
  description: "Track your fitness journey and achieve your goals",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen text-slate-900 dark:text-slate-100">
        <UserProvider>
          <ThemeProvider defaultTheme="system" storageKey="fittrack-theme">
            <div className="container-max py-8">
              {children}
            </div>
          </ThemeProvider>
        </UserProvider>
      </body>
    </html>
  );
}