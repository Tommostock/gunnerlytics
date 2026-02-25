import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gunnerlytics — Arsenal F.C. Historical Player Database",
  description:
    "The complete statistical database for every player who has represented Arsenal Football Club. Explore stats, compare legends, and discover the history of the Gunners.",
  keywords: ["Arsenal", "Football", "Statistics", "Player Database", "Premier League"],
  openGraph: {
    title: "Gunnerlytics",
    description: "Arsenal F.C. Historical Player Database",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EF0107",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 border-b border-surface-200 dark:border-surface-800 bg-white/80 dark:bg-surface-950/80 backdrop-blur-md">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-arsenal-red flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-lg text-surface-900 dark:text-surface-100">
                  Gunnerlytics
                </span>
              </Link>

              <nav className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 hover:text-arsenal-red dark:hover:text-arsenal-red transition-colors rounded-lg hover:bg-surface-100 dark:hover:bg-surface-900"
                >
                  Players
                </Link>
                <Link
                  href="/compare"
                  className="px-3 py-1.5 text-sm text-surface-600 dark:text-surface-400 hover:text-arsenal-red dark:hover:text-arsenal-red transition-colors rounded-lg hover:bg-surface-100 dark:hover:bg-surface-900"
                >
                  Compare
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          {/* Main */}
          <main className="flex-1">
            <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
          </main>

          {/* Footer */}
          <footer className="border-t border-surface-200 dark:border-surface-800 py-6">
            <div className="max-w-6xl mx-auto px-4 text-center text-xs text-surface-400">
              <p>
                Gunnerlytics &mdash; Arsenal F.C. Historical Player Database
              </p>
              <p className="mt-1">
                Data sourced from public records. Not affiliated with Arsenal
                Football Club.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
