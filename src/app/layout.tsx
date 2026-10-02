import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Village | Find things to do. Find your people.",
  description:
    "Discover things your kids will love, find time for yourself, and meet parents nearby.",
  openGraph: {
    title: "Village | Find things to do. Find your people.",
    description:
      "Discover activities for your kids, make time for yourself, and meet parents nearby.",
    siteName: "Village",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
