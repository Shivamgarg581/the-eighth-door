import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manifestation — Infinite Motion",
  description: "A full-screen generative visual that never stops moving.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
