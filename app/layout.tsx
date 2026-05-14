import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Prode Mundial 2026",
  description: "Pronosticá los partidos del Mundial 2026 con tus amigos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className={`${geist.className} min-h-full flex flex-col bg-gray-950 text-white`}>
        {children}
      </body>
    </html>
  );
}
