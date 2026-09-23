import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Payflow Precision Fintech",
  description: "Dashboard for Payflow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body className="bg-[#F8F9FC] text-[#141b2b] text-[14px] leading-[20px] tracking-[-0.005em] min-h-screen font-sans flex flex-col md:block">
        <Sidebar />
        <div className="md:pl-[240px]">
          <Header />
          <main className="w-full flex-1 md:flex-none px-4 pt-5 pb-6 md:pt-16 md:px-6 md:py-4 md:min-h-screen bg-[#F8F9FC]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
