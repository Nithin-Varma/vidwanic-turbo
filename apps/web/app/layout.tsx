import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vidwanic Magazine",
  description: "Educational magazine platform for India",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}