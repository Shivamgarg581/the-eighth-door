import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Starfall — 2D Night Survival",
  description: "Catch the light. Survive the dark. A fast 2D browser arcade game.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
