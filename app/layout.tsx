import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Đăng ký học phần NLU",
  description: "Modern SaaS-inspired schedule planner for students.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen antialiased bg-slate-950 text-slate-50`}
      >
        {children}
      </body>
    </html>
  );
}
