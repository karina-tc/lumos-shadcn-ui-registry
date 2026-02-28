import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { FullAppShell } from "@/components/full-app-layout";

import "@/app/globals.css";

const GeistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const GeistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        GeistSans.variable,
        GeistMono.variable,
        "h-full bg-background text-foreground",
      )}
    >
      <body className="h-full">
        <FullAppShell>{children}</FullAppShell>
      </body>
    </html>
  );
}
