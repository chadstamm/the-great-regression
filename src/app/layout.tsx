import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter, Bangers } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const bangers = Bangers({
  variable: "--font-comic",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Great Regression Countdown",
  description: "Cada Minuto Conta — The bucket list before we go",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⏳</text></svg>",
    apple: "/images/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Great Regression",
  },
  openGraph: {
    title: "Cada Minuto Conta",
    description: "The Great Regression — Portugal Bucket List 2026",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 675 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cada Minuto Conta",
    description: "The Great Regression — Portugal Bucket List 2026",
    images: ["/images/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${bangers.variable}`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
