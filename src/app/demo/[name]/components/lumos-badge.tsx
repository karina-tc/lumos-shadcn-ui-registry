import { LumosBadge } from "@/components/lumos-badge";

export const lumosBadge = {
  name: "lumos-badge",
  components: {
    Default: (
      <div className="flex flex-wrap items-center gap-2 p-8 bg-background">
        <LumosBadge variant="default">Default</LumosBadge>
        <LumosBadge variant="blue">Blue</LumosBadge>
        <LumosBadge variant="purple">Purple</LumosBadge>
        <LumosBadge variant="pink">Pink</LumosBadge>
        <LumosBadge variant="teal">Teal</LumosBadge>
        <LumosBadge variant="lemon">Lemon</LumosBadge>
        <LumosBadge variant="orange">Orange</LumosBadge>
        <LumosBadge variant="success">Success</LumosBadge>
        <LumosBadge variant="danger">Danger</LumosBadge>
        <LumosBadge variant="warning">Warning</LumosBadge>
      </div>
    ),
  },
};
