import type { Metadata } from "next";
import { FullAppShell } from "@/components/full-app-layout";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Lumos",
  description: "Enterprise access management platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <FullAppShell>{children}</FullAppShell>
      </body>
    </html>
  );
}
