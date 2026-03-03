import type { ReactNode } from "react";
import { PreviewShell } from "./preview-shell";

export default function PreviewLayout({ children }: { children: ReactNode }) {
  return <PreviewShell>{children}</PreviewShell>;
}
