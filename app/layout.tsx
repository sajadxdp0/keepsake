import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keepsake — keep a moment",
  description: "Create a personal keepsake. Your photos stay yours.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
