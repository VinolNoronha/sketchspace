import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Sketchspace — Collaborative Whiteboard",
  description:
    "Real-time collaborative whiteboard built with Next.js, FastAPI and WebSockets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          background: "#f8f9fa",
        }}
      >
        {children}
      </body>
    </html>
  );
}
