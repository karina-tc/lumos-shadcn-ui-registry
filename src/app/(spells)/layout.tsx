import type { ReactNode } from "react";

export default function SpellsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="w-full">{children}</div>;
}
