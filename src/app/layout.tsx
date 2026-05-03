import type { Metadata } from "next";
import { Cormorant_Garamond, Playfair_Display, Montserrat, Lato } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CASUAL | Old Money Fashion",
  description: "Timeless elegance, crafted for the discerning. Discover curated collections of premium shirts, trousers, shoes, and accessories.",
  keywords: ["Old Money", "Fashion", "Luxury", "Premium", "Shirts", "Trousers", "Shoes", "Accessories"],
  icons: {
    icon: "/logo.svg",
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
        className={`${cormorant.variable} ${playfair.variable} ${montserrat.variable} ${lato.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
