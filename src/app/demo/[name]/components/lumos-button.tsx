import { LumosButton } from "@/components/lumos-button";

export const lumosButton = {
  name: "lumos-button",
  components: {
    Default: (
      <div className="flex flex-wrap items-center gap-3 p-8 bg-background">
        <LumosButton variant="primary">Primary</LumosButton>
        <LumosButton variant="secondary">Secondary</LumosButton>
        <LumosButton variant="danger">Danger</LumosButton>
        <LumosButton variant="ghost">Ghost</LumosButton>
        <LumosButton variant="accent">Accent</LumosButton>
        <LumosButton variant="primary" size="sm">Small</LumosButton>
        <LumosButton variant="primary" disabled>Disabled</LumosButton>
      </div>
    ),
  },
};
