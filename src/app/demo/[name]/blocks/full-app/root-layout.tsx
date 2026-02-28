import type { ReactNode } from "react";

import { FullAppShell } from "@/components/full-app-layout";

import "@/app/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-background text-foreground">
      <body className="h-full">
        <FullAppShell>{children}</FullAppShell>
      </body>
    </html>
  );
}
