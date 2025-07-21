import "./globals.css";
import React, { Suspense } from "react";
import Loader from "./components/Loader";

export const metadata = {
  title: "Vidwanic Magazine",
  description: "A modern educational magazine platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#edf0f2]">
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </body>
    </html>
  );
}