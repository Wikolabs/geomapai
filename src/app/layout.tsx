import type { Metadata } from "next";
import { Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";

const fontDisplay = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

const fontBody = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "GeoMapAI — Vos données géographiques, enfin actionnables",
  description:
    "Analyse spatiale IA, geocoding automatique et visualisation cartographique pour logistics, immobilier et territoire.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${fontDisplay.variable} ${fontBody.variable}`}
        style={{ background: "#f0fdf4", fontFamily: "var(--font-body)" }}
      >
        {children}
      </body>
    </html>
  );
}
