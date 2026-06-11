import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import TabBar from "@/components/tab-bar";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Ogohlantirish — Oqtepa qishlog'i",
  description: "Operator uchun favqulodda ogohlantirish tizimi",
};

export const viewport: Viewport = {
  themeColor: "#101218",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={cn("dark", inter.variable, jetbrainsMono.variable)}>
      <body className="min-h-full">
        <div className="mx-auto flex min-h-screen w-full flex-col pt-3 max-w-md">
          <main className="flex-1 overflow-y-auto pb-28">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
