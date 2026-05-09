import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quick on My Feet",
  description: "AI-powered witty reply coach for texts, DMs, and awkward conversations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
