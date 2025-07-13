import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TopNavigation } from "@/components/top-navigation";
import { MobileBottomNav } from "@/components/mobile-bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HR Dashboard - Employee Management System",
  description: "Modern HR management dashboard built with Next.js and TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background">
            {/* Top Navigation */}
            <TopNavigation />
            
            {/* Main Content */}
            <main className="pb-20 md:pb-0">
              {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <MobileBottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
