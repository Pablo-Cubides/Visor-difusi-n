import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Visor del Proceso de Difusión",
  description: "Una aplicación educativa para visualizar el proceso de difusión de texto a imagen.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-[#0A0E27] text-[#FFFFFF]`}>{children}</body>
    </html>
  );
}
