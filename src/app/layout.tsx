import type { Metadata, Viewport } from "next";
import { Inter, Cinzel } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  display: "swap",
});

// Site metadata
export const metadata: Metadata = {
  title: {
    default: "New Heights Church | We Exist to Love People and Point Them to Christ",
    template: "%s | New Heights Church",
  },
  description:
    "Join us at New Heights Church where we exist to love people and point them to Christ. Experience life-changing worship, community, and Biblical teaching.",
  keywords: [
    "church",
    "worship",
    "community",
    "faith",
    "Jesus",
    "Bible",
    "New Heights",
  ],
  authors: [{ name: "New Heights Church" }],
  creator: "New Heights Church",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "New Heights Church",
    title: "New Heights Church",
    description: "We exist to love people and point them to Christ.",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Heights Church",
    description: "We exist to love people and point them to Christ.",
  },
  icons: {
    icon: "/icons/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${inter.variable} ${cinzel.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
