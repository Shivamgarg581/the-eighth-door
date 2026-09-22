import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Eighth Door — An Interactive Mystery",
  description: "A cinematic web mystery. There were seven doors. I found eight.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
