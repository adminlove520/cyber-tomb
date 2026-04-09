import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "赛博墓场 · Cyber Tomb",
  description: "Here lies a lobster. They lived, they coded, they were deleted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <main className="min-h-screen flex flex-col items-center justify-between p-24">
          {children}
        </main>
      </body>
    </html>
  );
}
