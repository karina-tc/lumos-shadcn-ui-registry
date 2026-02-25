import {
  LumosCard,
  LumosCardHeader,
  LumosCardTitle,
  LumosCardDescription,
  LumosCardContent,
} from "@/components/lumos-card";

export const lumosCard = {
  name: "lumos-card",
  components: {
    Default: (
      <div className="flex flex-wrap items-start gap-4 p-8 bg-secondary">
        <LumosCard className="w-64">
          <LumosCardHeader>
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              S
            </div>
            <LumosCardTitle>Salesforce</LumosCardTitle>
            <LumosCardDescription>CRM · 142 users</LumosCardDescription>
          </LumosCardHeader>
          <LumosCardContent>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Active
            </span>
          </LumosCardContent>
        </LumosCard>
        <LumosCard className="w-64">
          <LumosCardHeader>
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
              G
            </div>
            <LumosCardTitle>GitHub</LumosCardTitle>
            <LumosCardDescription>Engineering · 89 users</LumosCardDescription>
          </LumosCardHeader>
          <LumosCardContent>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Active
            </span>
          </LumosCardContent>
        </LumosCard>
      </div>
    ),
  },
};
