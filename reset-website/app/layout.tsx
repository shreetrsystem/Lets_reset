import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import type { Viewport } from "next";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#111111",
};

export const metadata: Metadata = {
  title: "Let's Reset | TASTES AMAZING. FEELS EVEN BETTER.",
  description: "Naturally fermented kombucha with live cultures and zero shortcuts. Fermented, functional, feel-good beverages.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://reset-brand.com"),
  openGraph: {
    title: "Let's Reset | Premium Kombucha",
    description: "Naturally fermented kombucha with live cultures and zero shortcuts. Tastes amazing. Feels even better.",
    url: "https://reset-brand.com",
    siteName: "Let's Reset",
    images: [
      {
        url: "/cranberry.png", // Typically you want a full absolute URL for this in production or relative with metadataBase
        width: 800,
        height: 600,
        alt: "Let's Reset Kombucha Cans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Let's Reset | Premium Kombucha",
    description: "Naturally fermented kombucha with live cultures.",
    images: ["/cranberry.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org/",
  "@type": "Brand",
  "name": "Let's Reset Kombucha",
  "description": "Naturally fermented kombucha with live cultures and zero shortcuts.",
  "url": "https://reset-brand.com",
  "logo": "https://reset-brand.com/icon-512x512.png",
  "knowsAbout": ["Kombucha", "Health", "Probiotics", "Fermentation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${outfit.variable} antialiased font-sans`}
      >
        <Providers>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <Toaster position="bottom-right" />
          {children}
        </Providers>
      </body>
    </html>
  );
}
