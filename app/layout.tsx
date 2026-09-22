import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Room — A Living Conversation",
  description: "Ask anything. The room chooses the character, atmosphere and cinematic way to answer.",
  keywords: ["interactive chat", "cinematic chat", "stories", "mystery", "horror", "comedy"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
