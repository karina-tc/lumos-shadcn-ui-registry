import React, { type ReactNode } from "react";

export default function MinimalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="flex h-full w-full justify-center">
      <div className="h-full w-full">{children}</div>
    </main>
  );
}
