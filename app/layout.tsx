import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

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
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col transition-colors duration-1000">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
