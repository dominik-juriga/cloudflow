import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// Demo - explain
export const metadata: Metadata = {
  title: {
    template: "%s | Cloudflow",
    default: "Cloudflow",
  },
  description: "Visualize your mind",
};

// Demo - explain
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
