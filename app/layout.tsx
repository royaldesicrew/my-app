import type { Metadata } from "next";
import { Playfair_Display, Montserrat, Geist, Caveat } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/SmoothScroll";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-handwritten",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Royal Desi Crew | Premium Event Management",
  description: "Experience the epitome of luxury event management with Royal Desi Crew. We craft unforgettable moments with a touch of royalty.",
  icons: {
    icon: "/image.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={`${playfair.variable} ${montserrat.variable} ${caveat.variable} font-body antialiased`}>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}

