import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { themeConfig } from "@/lib/theme";

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
    <html lang="en" className={themeConfig.darkMode ? "dark" : ""}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
