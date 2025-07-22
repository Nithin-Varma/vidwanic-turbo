import "./globals.css";
import React, { Suspense } from "react";
import Loader from "./components/Loader";
import { Providers } from "./providers";

export const metadata = {
  title: "Vidwanic Magazine",
  description: "A modern educational magazine platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-[#edf0f2]">
        <Providers>
          <Suspense fallback={<Loader />}>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}