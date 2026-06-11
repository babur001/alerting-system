import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";
import { OgohProvider } from "@/components/ogoh/provider";
import BottomTabs from "@/components/ogoh/bottom-tabs";

const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

const SITE_NAME = "OGOH";
const TITLE = "OGOH — Suv toʻsiq ogohlantirish tizimi";
const DESCRIPTION =
  "Operator uchun favqulodda ogohlantirish tizimi — aholini SMS orqali xabardor qilish.";

// og:image / twitter:image must resolve to absolute URLs on the real domain:
// NEXT_PUBLIC_SITE_URL if set, else the Vercel production domain, else localhost.
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: [
    "ogohlantirish",
    "favqulodda",
    "suv toshqini",
    "suv toʻsiq",
    "SMS xabar",
    "early warning system",
  ],
  category: "public safety",
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "uz_UZ",
    title: TITLE,
    description: DESCRIPTION,
    // Static assets pre-rendered by scripts/generate-share-images.mjs
    images: [{ url: "/og.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", alt: TITLE }],
  },
  icons: {
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0C0D10",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function OgohLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uz" className={cn("dark ogoh", plexSans.variable, plexMono.variable)}>
      <body className="min-h-full">
        <OgohProvider>
          <div className="og-hatch mx-auto flex h-dvh w-full max-w-md flex-col overflow-hidden bg-og-bg text-og-ink">
            <div className="relative flex-1 overflow-hidden">{children}</div>
            <BottomTabs />
          </div>
        </OgohProvider>
      </body>
    </html>
  );
}
