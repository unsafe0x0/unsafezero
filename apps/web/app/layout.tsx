import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unsafezero.vercel.app"),
  title: {
    default: "UnsafeZero - Creative Tools & Projects",
    template: "%s | UnsafeZero",
  },
  description:
    "Explore creative tools and experimental projects by UnsafeZero. Free online tools for image dithering, ASCII art, and more.",
  keywords: [
    "web tools",
    "image processing",
    "dithering",
    "dithering",
    "ascii art",
    "creative tools",
    "online tools",
    "UnsafeZero",
  ],
  authors: [{ name: "UnsafeZero" }],
  creator: "UnsafeZero",
  publisher: "UnsafeZero",

  twitter: {
    card: "summary_large_image",
    title: "UnsafeZero - Creative Tools & Projects",
    description:
      "Explore creative tools and experimental projects by UnsafeZero.",
    creator: "@unsafezero",
    images: ["/og-default.png"],
  },
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
