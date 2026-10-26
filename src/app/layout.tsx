import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Metabolic Health Tracker | HOMA-IR, TG:HDL Ratio & Insulin Resistance",
  description: "Track and trend your metabolic syndrome biomarkers including HOMA-IR, Fasting Insulin, Fasting Glucose, and Triglyceride-to-HDL ratio, plus AI-customized resistance workouts.",
  keywords: [
    "Metabolic Health Tracker",
    "HOMA-IR calculator",
    "Triglyceride to HDL ratio calculator",
    "insulin resistance tracker",
    "reverse metabolic syndrome",
    "fasting insulin tracker",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
