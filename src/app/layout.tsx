import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { themeConfig } from "@/lib/theme";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UI Schema Builder",
  description: "Build UI with schemas and shadcn/ui components",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={cn(themeConfig.darkMode ? "dark" : "", inter.className)}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
